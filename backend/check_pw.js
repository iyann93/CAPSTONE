const bcrypt = require('bcrypt');
const hash = '$2b$10$sDyw8I8/dl.tKC2Vb435bOW1wNXRIibn5lPbPbNDwsX7CPoyZgWgK';
bcrypt.compare('password123', hash).then(res => console.log('password123:', res));
bcrypt.compare('guru123', hash).then(res => console.log('guru123:', res));
bcrypt.compare('123456', hash).then(res => console.log('123456:', res));
