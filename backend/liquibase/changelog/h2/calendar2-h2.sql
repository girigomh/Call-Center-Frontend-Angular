
drop table if exists calendar_actors CASCADE;
drop table if exists calendars CASCADE;
drop table if exists events;

create table events (id bigint not null, creation_date timestamp not null, event_date date not null, duration time not null, event_type varchar(255) not null, name varchar(255) not null, title varchar(255) not null, update_date timestamp not null, address_id bigint, owner_user_id bigint, primary key (id));
create table event_adresses (id bigint not null, city varchar(255), country varchar(255), house_no varchar(255), laptitude bigint, location varchar(255), longitude bigint, note varchar(2000), phone_no varchar(25), state varchar(255), street varchar(255), zip integer, primary key (id));
create table local_events (latency time not null, time_of_travel time not null, travel_costs numeric(19,2) not null, id bigint not null, primary key (id));
create table online_events (costs_video_call numeric(19,2) not null, time_record time not null, url varchar(255) not null, id bigint not null, primary key (id));
create table user_events (user_id bigint not null, event_id bigint not null);

alter table events add constraint FK_events_addrss_id foreign key (address_id) references event_adresses;
alter table events add constraint FK_events_owner_user_id foreign key (owner_user_id) references users;
alter table local_events add constraint FK_local_events_events foreign key (id) references events;
alter table online_events add constraint FK_online_events_events foreign key (id) references events;
alter table user_events add constraint FK_user_events_event_id foreign key (event_id) references events;
alter table user_events add constraint FK_user_events_user_id foreign key (user_id) references users;