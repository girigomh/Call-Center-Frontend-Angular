drop sequence if exists event_seq;
drop sequence if exists hibernate_sequence;
drop sequence if exists location_seq;
drop sequence if exists price_pattern_seq;
create sequence event_seq start with 1 increment by 50;
create sequence hibernate_sequence start with 1000 increment by 1;
create sequence location_seq start with 1 increment by 50;
create sequence price_pattern_seq start with 1 increment by 50;

