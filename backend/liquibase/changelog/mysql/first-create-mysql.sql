create table admins (id bigint not null, zip integer, birthday timestamp, counter time, country varchar(255), first_name varchar(255), house_no varchar(255), last_login timestamp, last_name varchar(255), location varchar(255), online_status boolean, password varchar(255) not null, pdfs binary(255), phone_no varchar(255), profilephoto varchar(255), street varchar(255), type varchar(255), user_since timestamp, username varchar(255) not null, role_id bigint, sms_certification boolean not null, name varchar(255) not null, title varchar(255) not null, user_id bigint, primary key (id));

create table companies (id bigint not null, zip integer, birthday timestamp, counter time, country varchar(255), first_name varchar(255), house_no varchar(255), last_login timestamp, last_name varchar(255), location varchar(255), online_status boolean, password varchar(255) not null, pdfs binary(255), phone_no varchar(255), profilephoto varchar(255), street varchar(255), type varchar(255), user_since timestamp, username varchar(255) not null, role_id bigint, invoice varchar(255) not null, link_for_video_call varchar(255) not null, url varchar(255) not null, company_types_id bigint, primary key (id));

create table company_types (id bigint not null, name varchar(255) not null, primary key (id));

create table calendars (id bigint not null, name varchar(255) not null, title varchar(255) not null, user_id bigint not null, primary key (id));

create table customers (id bigint not null, zip integer, birthday timestamp, counter time, country varchar(255), first_name varchar(255), house_no varchar(255), last_login timestamp, last_name varchar(255), location varchar(255), online_status boolean, password varchar(255) not null, pdfs binary(255), phone_no varchar(255), profilephoto varchar(255), street varchar(255), type varchar(255), user_since timestamp, username varchar(255) not null, role_id bigint, balance double not null, primary key (id));

create table emails (id bigint not null, email varchar(255) not null, name varchar(255) not null, title varchar(255) not null, user_id bigint, primary key (id));

create table events (id bigint not null, content varchar(512), description varchar(256), duration integer not null, event_type varchar(255) not null, name varchar(64) not null, primary key (id));

create table files (id bigint not null, data blob, file_type varchar(255), name varchar(255), primary key (id));

create table interpreters (id bigint not null, zip integer, birthday timestamp, counter time, country varchar(255), first_name varchar(255), house_no varchar(255), last_login timestamp, last_name varchar(255), location varchar(255), online_status boolean, password varchar(255) not null, pdfs binary(255), phone_no varchar(255), profilephoto varchar(255), street varchar(255), type varchar(255), user_since timestamp, username varchar(255) not null, role_id bigint, bank_details varchar(255) not null, certificate boolean not null, location_online boolean not null, topic_knowledge binary(255) not null, primary key (id));

create table locations (id bigint not null, city varchar(64) not null, country varchar(64) not null, description varchar(128), location_name varchar(64) not null, postal_code varchar(16) not null, street varchar(64) not null, primary key (id));

create table login_attempts (id bigint not null, attempts integer, blocked boolean, primary key (id));

create table price_patterns (id bigint not null, name varchar(255), primary key (id));

create table price_pattern_price_mapping (price_pattern_id bigint not null, price_mapping double, price_mapping_key integer not null, primary key (price_pattern_id, price_mapping_key));

create table roles (id bigint not null, name varchar(255) not null, primary key (id));

create table timesheets (id bigint not null, name varchar(255) not null, sheet varchar(255) not null, user_id bigint, primary key (id));

create table users (id bigint not null, zip integer, birthday timestamp, counter time, country varchar(255), first_name varchar(255), house_no varchar(255), last_login timestamp, last_name varchar(255), location varchar(255), online_status boolean, password varchar(255) not null, pdfs binary(255), phone_no varchar(255), profilephoto varchar(255), street varchar(255), type varchar(255), user_since timestamp, username varchar(255) not null, role_id bigint, primary key (id));

create table user_news (id bigint not null, news_id bigint, user_id bigint, primary key (id));

alter table admins add constraint UK_2tja96e2oambifv95b8wq6qp9 unique (sms_certification);

alter table admins add constraint UK_5cca88c6i17ttuegcvdkgehah unique (name);

alter table admins add constraint UK_dyq46samjfqb2hqdyfqy1ylo unique (title);


alter table companies add constraint UK_s453w5ag3u2jbnyfmys490k0 unique (invoice);

alter table companies add constraint UK_3829h88j7ceafvhfp9s9sha5h unique (link_for_video_call);


alter table company_types add constraint UK_jt6ap1u2sm77e1obnl9p07k7o unique (name);


alter table emails add constraint UK_ek29mh30yo2rxnsy4svwbgogh unique (email);

alter table emails add constraint UK_98pisbdp2dcltupqrdix19opc unique (name);

alter table emails add constraint UK_hx46tsyjun592mg450wd9y4pj unique (title);


alter table interpreters add constraint UK_qbq2343s1lb93bex0k5krvlc4 unique (bank_details);

alter table interpreters add constraint UK_o5urtgio90nptw4aji75w7y6d unique (certificate);

alter table roles add constraint UK_8sewwnpamngi6b1dwaa88askk unique (name);

alter table timesheets add constraint UK_hpxrsvb72tmcb2r9s29pacp4p unique (name);

alter table timesheets add constraint UK_kt169vfqvp1buyhh32t8f2ipd unique (sheet);


alter table admins add constraint FK_7umlrlm5h3qupdivkhe5gj707 foreign key (role_id) references roles(id);

alter table companies add constraint FKtle8dllhekyx8lbfycue0eild foreign key (company_types_id) references company_types(id);

alter table companies add constraint FK_e36a95rjthus6e198s2x8qvbl foreign key (role_id) references roles(id);

alter table customers add constraint FK_p63irs9lqa0aij8rwbpitllw foreign key (role_id) references roles(id);

alter table interpreters add constraint FK_tkxabb4j7b0vi43towbr2gse4 foreign key (role_id) references roles(id);

alter table price_pattern_price_mapping add constraint FKny5h8r35a08o8yfmyir6ox610 foreign key (price_pattern_id) references price_patterns(id);

alter table users add constraint FKn82ha3ccdebhokx3a8fgdqeyy foreign key (role_id) references roles(id);
