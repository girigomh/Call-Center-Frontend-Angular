create database callcenter;

CREATE USER 'nikolay'@'localhost' IDENTIFIED  BY 'ikiN!23Nim';

GRANT ALL ON callcenter.* TO 'nikolay'@'%';
