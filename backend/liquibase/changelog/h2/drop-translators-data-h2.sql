delete from login_attempts where user_id in (select user_id from users where user_type='TRANSLATOR');
delete from users where user_type='TRANSLATOR';