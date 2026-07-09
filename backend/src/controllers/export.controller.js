'use strict';

const { query } = require('../config/db');
const archiver = require('archiver');
const ExcelJS = require('exceljs');
const fs = require('fs');

/**
 * Excluded schemas that are system-only
 */
const EXCLUDED_SCHEMAS = ['pg_catalog', 'information_schema', 'pg_toast'];

const ExportController = {
  // 1. Get all tables and their stats
  getTables: async (req, res, next) => {
    try {
      const sql = `
        SELECT 
          schemaname AS schema_name, 
          relname AS table_name, 
          n_live_tup AS records,
          pg_total_relation_size(relid) AS size_bytes
        FROM pg_stat_user_tables 
        WHERE schemaname NOT IN ($1, $2, $3)
        ORDER BY schemaname, relname;
      `;
      const result = await query(sql, EXCLUDED_SCHEMAS);
      
      const tables = result.rows;
      
      // Group by schema
      const grouped = tables.reduce((acc, row) => {
        const modName = row.schema_name.charAt(0).toUpperCase() + row.schema_name.slice(1);
        if (!acc[modName]) {
          acc[modName] = [];
        }
        
        let sizeFormatted = row.size_bytes;
        if (row.size_bytes > 1024 * 1024) {
          sizeFormatted = (row.size_bytes / (1024 * 1024)).toFixed(2) + ' MB';
        } else if (row.size_bytes > 1024) {
          sizeFormatted = (row.size_bytes / 1024).toFixed(1) + ' KB';
        } else {
          sizeFormatted = row.size_bytes + ' B';
        }

        acc[modName].push({
          schema: row.schema_name,
          name: row.table_name,
          records: row.records,
          size: sizeFormatted,
          updated: "Hari ini" // Mock updated time since PG doesn't track last modified easily without triggers
        });
        return acc;
      }, {});

      // Convert to array format expected by frontend
      const modules = Object.keys(grouped).map(name => ({
        name: name,
        count: grouped[name].length
      }));

      res.json({ success: true, data: { modules, tables: grouped } });
    } catch (err) {
      next(err);
    }
  },

  // 2. Export a specific table
  exportTable: async (req, res, next) => {
    try {
      const { schema, table } = req.params;
      const { format } = req.query; // json, csv, excel

      // Validate schema/table to prevent injection
      const validationSql = `SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2`;
      const check = await query(validationSql, [schema, table]);
      if (check.rowCount === 0) {
        return res.status(404).json({ success: false, message: "Tabel tidak ditemukan" });
      }

      // Fetch data
      const dataSql = `SELECT * FROM "${schema}"."${table}" LIMIT 10000`; // Limit to prevent memory crash
      const result = await query(dataSql);
      
      const dict = await ExportController.buildDictionaries();
      const rows = result.rows.map(r => ExportController.translateRow(r, dict));

      if (format === 'json') {
        return res.json({ success: true, data: rows });
      }

      if (format === 'csv') {
        const fields = rows.length > 0 ? Object.keys(rows[0]) : result.fields.map(f => f.name);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${table}.csv"`);
        
        let csv = fields.join(',') + '\n';
        rows.forEach(row => {
          csv += fields.map(f => {
            const val = row[f] !== null && row[f] !== undefined ? String(row[f]) : '';
            return `"${val.replace(/"/g, '""')}"`;
          }).join(',') + '\n';
        });
        return res.send(csv);
      }

      if (format === 'excel') {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(table.substring(0, 31)); // Max length 31
        
        if (rows.length > 0) {
          const columns = Object.keys(rows[0]).map(key => ({ header: key, key }));
          sheet.columns = columns;
          sheet.addRows(rows);
          
          sheet.columns.forEach(column => {
            let maxLength = 0;
            column["eachCell"]({ includeEmpty: true }, function(cell) {
              const columnLength = cell.value ? cell.value.toString().length : 10;
              if (columnLength > maxLength) {
                maxLength = columnLength;
              }
            });
            column.width = maxLength < 10 ? 10 : maxLength + 2;
          });
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${table}.xlsx"`);
        
        await workbook.xlsx.write(res);
        return res.end();
      }

      res.status(400).json({ success: false, message: "Format tidak didukung" });
    } catch (err) {
      next(err);
    }
  },

  // 3. Export full database (Zip or Multi-sheet Excel)
  exportFull: async (req, res, next) => {
    try {
      const { format, scope, module_name } = req.query;

      // Get tables
      let schemaFilter = "schemaname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')";
      let params = [];
      if (scope === 'module' && module_name) {
        schemaFilter = "schemaname = $1";
        params.push(module_name.toLowerCase());
      }

      const tableSql = `SELECT schemaname, relname FROM pg_stat_user_tables WHERE ${schemaFilter}`;
      const tableResult = await query(tableSql, params);
      const tables = tableResult.rows;

      if (format === 'excel') {
        const workbook = new ExcelJS.Workbook();
        const dict = await ExportController.buildDictionaries();
        
        for (const t of tables) {
          const sheetName = (t.schemaname + '_' + t.relname).substring(0, 31);
          const sheet = workbook.addWorksheet(sheetName);
          
          const dataResult = await query(`SELECT * FROM "${t.schemaname}"."${t.relname}" LIMIT 5000`);
          const rows = dataResult.rows.map(r => ExportController.translateRow(r, dict));

          if (rows.length > 0) {
            const columns = Object.keys(rows[0]).map(key => ({ header: key, key }));
            sheet.columns = columns;
            sheet.addRows(rows);

            sheet.columns.forEach(column => {
              let maxLength = 0;
              column["eachCell"]({ includeEmpty: true }, function(cell) {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                  maxLength = columnLength;
                }
              });
              column.width = maxLength < 10 ? 10 : maxLength + 2;
            });
          } else {
            sheet.addRow(["Tabel Kosong"]);
          }
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="Full_Backup_${new Date().getTime()}.xlsx"`);
        
        await workbook.xlsx.write(res);
        return res.end();
      }

      if (format === 'zip') {
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="Full_Backup_${new Date().getTime()}.zip"`);

        const archive = archiver('zip', {
          zlib: { level: 9 }
        });

        archive.on('error', function(err) {
          throw err;
        });

        archive.pipe(res);

        const dict = await ExportController.buildDictionaries();

        for (const t of tables) {
          const dataResult = await query(`SELECT * FROM "${t.schemaname}"."${t.relname}" LIMIT 5000`);
          const rows = dataResult.rows.map(r => ExportController.translateRow(r, dict));
          const fields = rows.length > 0 ? Object.keys(rows[0]) : dataResult.fields.map(f => f.name);
          
          let csv = fields.join(',') + '\n';
          rows.forEach(row => {
            csv += fields.map(f => {
              const val = row[f] !== null && row[f] !== undefined ? String(row[f]) : '';
              return `"${val.replace(/"/g, '""')}"`;
            }).join(',') + '\n';
          });

          archive.append(csv, { name: `${t.schemaname}/${t.relname}.csv` });
        }

        await archive.finalize();
        return;
      }

      if (format === 'sql') {
        // Fallback for SQL since we can't easily pg_dump from node without child_process + proper pg_dump installed.
        // We will generate a basic SQL insert script.
        res.setHeader('Content-Type', 'application/sql');
        res.setHeader('Content-Disposition', `attachment; filename="Full_Backup_${new Date().getTime()}.sql"`);

        let sqlContent = "-- SIMULASI DUMP DATABASE (DATA TERBATAS)\n\n";
        for (const t of tables) {
          sqlContent += `-- Table: ${t.schemaname}.${t.relname}\n`;
          const dataResult = await query(`SELECT * FROM "${t.schemaname}"."${t.relname}" LIMIT 500`);
          
          dataResult.rows.forEach(row => {
            const keys = Object.keys(row);
            const vals = keys.map(k => {
              const val = row[k];
              if (val === null) return 'NULL';
              if (typeof val === 'number') return val;
              if (typeof val === 'boolean') return val;
              return `'${String(val).replace(/'/g, "''")}'`;
            });
            sqlContent += `INSERT INTO "${t.schemaname}"."${t.relname}" ("${keys.join('","')}") VALUES (${vals.join(',')});\n`;
          });
          sqlContent += '\n';
        }
        return res.send(sqlContent);
      }

      res.status(400).json({ success: false, message: "Format tidak didukung" });
    } catch (err) {
      next(err);
    }
  },

  // Helpers to translate UUIDs to readable text for exports
  buildDictionaries: async () => {
    const dict = { siswa: {}, jadwal: {}, users: {}, kelas: {}, guru: {}, mapel: {} };
    try {
      const res = await query(`SELECT id, nisn FROM "academic"."siswa"`);
      res.rows.forEach(r => dict.siswa[r.id] = r.nisn);
    } catch(e) {}
    try {
      const mapelRes = await query(`SELECT id, kode FROM "academic"."mata_pelajaran"`);
      const mapelMap = {};
      mapelRes.rows.forEach(r => {
        mapelMap[r.id] = r.kode;
        dict.mapel[r.id] = r.kode;
      });
      const jadwalRes = await query(`SELECT id, mata_pelajaran_id FROM "academic"."jadwal_pelajaran"`);
      jadwalRes.rows.forEach(r => dict.jadwal[r.id] = mapelMap[r.mata_pelajaran_id] || r.id);
    } catch(e) {}
    try {
      const res = await query(`SELECT id, nama FROM "shared"."users"`);
      res.rows.forEach(r => dict.users[r.id] = r.nama);
    } catch(e) {}
    try {
      const res = await query(`SELECT id, nama_lengkap FROM "academic"."guru"`);
      res.rows.forEach(r => dict.guru[r.id] = r.nama_lengkap);
    } catch(e) {}
    try {
      const res = await query(`SELECT id, nama_kelas FROM "academic"."kelas"`);
      res.rows.forEach(r => dict.kelas[r.id] = r.nama_kelas);
    } catch(e) {}
    return dict;
  },

  translateRow: (row, dict) => {
    const newRow = {};
    const excludedColumns = [
      'id', 'created_at', 'updated_at', 'deleted_at', 
      'password_hash', 'user_id', 'password', 'refresh_token',
      'reset_password_token', 'reset_password_expires'
    ];
    
    for (const key in row) {
      if (excludedColumns.includes(key)) {
        continue; // Omit system columns to prevent cluttered/squished PDFs
      }

      if (row[key] === null || row[key] === undefined) {
        newRow[key] = row[key];
        continue;
      }
      
      if (key === 'siswa_id') {
        newRow['NISN Siswa'] = dict.siswa[row[key]] || row[key];
      } else if (key === 'jadwal_id') {
        newRow['Kode Mata Pelajaran'] = dict.jadwal[row[key]] || row[key];
      } else if (key === 'mata_pelajaran_id') {
        newRow['Kode Mata Pelajaran'] = dict.mapel[row[key]] || row[key];
      } else if (key === 'pencatat_id' || key === 'dicatat_oleh') {
        newRow['Dicatat Oleh (Nama)'] = dict.users[row[key]] || row[key];
      } else if (key === 'guru_id') {
        newRow['Nama Guru'] = dict.guru[row[key]] || dict.users[row[key]] || row[key];
      } else if (key === 'wali_kelas_id') {
        newRow['Nama Wali Kelas'] = dict.guru[row[key]] || dict.users[row[key]] || row[key];
      } else if (key === 'kelas_id') {
        newRow['Nama Kelas'] = dict.kelas[row[key]] || row[key];
      } else {
        // Format raw column name from snake_case to Title Case (e.g. "nama_lengkap" -> "Nama Lengkap")
        const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        newRow[formattedKey] = row[key];
      }
    }
    return newRow;
  }
};

module.exports = ExportController;
