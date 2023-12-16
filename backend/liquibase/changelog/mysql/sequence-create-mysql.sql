create table event_seq (next_val bigint) engine=InnoDB;
insert into event_seq values ( 1000 );
create table hibernate_sequence (next_val bigint) engine=InnoDB;
insert into hibernate_sequence values ( 1000 );
create table location_seq (next_val bigint) engine=InnoDB;
insert into location_seq values ( 1000 );
create table price_pattern_seq (next_val bigint) engine=InnoDB;
insert into price_pattern_seq values ( 1000 );
