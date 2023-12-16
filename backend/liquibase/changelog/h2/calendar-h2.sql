ALTER TABLE calendars DROP COLUMN user_id;
ALTER TABLE calendars ADD COLUMN creation_date date not null;
ALTER TABLE calendars ADD COLUMN event_date date not null;

drop table if exists calendar_actors;
create table calendar_actors (id bigint not null, creator boolean not null, calendar_id bigint, user_id bigint, primary key (id));

alter table calendar_actors add constraint FK_calendar_actors_calendars foreign key (calendar_id) references calendars;
alter table calendar_actors add constraint FK_calendar_actors_users_id foreign key (user_id) references users;