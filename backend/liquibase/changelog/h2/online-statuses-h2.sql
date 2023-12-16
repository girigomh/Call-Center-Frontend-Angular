ALTER TABLE users ALTER COLUMN online_status SET DATA TYPE VARCHAR(50);

update users set online_status='ONLINE' where online_status='TRUE';
update users set online_status='INVISIBLE' where (online_status='FALSE' OR online_status IS NULL);