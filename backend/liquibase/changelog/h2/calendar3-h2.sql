
alter table events drop column address_id;
alter table events drop column duration;
alter table events add column duration integer not null;
alter table local_events add column address_id bigint not null;

drop table if exists event_adresses;
create table event_adresses (id bigint not null, city varchar(255), country varchar(255) not null, house_no varchar(255) not null, laptitude bigint, location varchar(255) not null, longitude bigint, note varchar(2000), phone_no varchar(25) not null, state varchar(255) not null, street varchar(255) not null, zip integer not null, primary key (id));

alter table local_events add constraint FK_local_events_address_id foreign key (address_id) references event_adresses