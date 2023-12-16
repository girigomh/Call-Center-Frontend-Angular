drop table if exists opening_hours;
drop table if exists organization_categories;

create table opening_hours (id bigint not null, closes time not null, opens time not null, organization varbinary(255), primary key (id));
create table organization_categories (id bigint not null, description varchar(255), name varchar(255), primary key (id));

ALTER TABLE companies ADD COLUMN description varchar(2000);
ALTER TABLE companies ADD COLUMN email varchar(255) not null default 'not set';
ALTER TABLE companies ADD COLUMN category_id bigint;

ALTER TABLE switching_centers ADD COLUMN description varchar(2000);
ALTER TABLE switching_centers ADD COLUMN email varchar(255) not null default 'not set';
ALTER TABLE switching_centers ADD COLUMN category_id bigint;

alter table companies add constraint FK_companies_category_id foreign key (category_id) references organization_categories;
alter table switching_centers add constraint FK_switching_centers_category_id foreign key (category_id) references organization_categories;
