alter table users add column token varchar(255) default null;
alter table users add column token_expiration TIMESTAMP default null;
alter table users add column email_confirmed BOOLEAN default false;
