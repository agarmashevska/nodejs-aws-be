 create EXTENSION if not EXISTS "uuid-ossp";

drop table if EXISTS products cascade
drop table if EXISTS stocks cascade

create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer
)

create table stocks (
	count integer,
	product_id uuid,
	foreign key("product_id") references "products"("id") on delete cascade on update cascade
)

truncate products cascade;
truncate stocks cascade;

CREATE function insVals (prTitle text, prDescription text, prPrice integer, prCount integer) RETURNS void as $$
	with prds as (
	  INSERT INTO products (title, description, price) values (prTitle, prDescription, prPrice) 
	  RETURNING id
	)
	INSERT INTO stocks (count, product_id) 
	VALUES (prCount, (select id from prds));
$$ LANGUAGE SQL;

select insVals('Orchids', 'Perfect white orchid flowers', 17, 25);
select insVals('Hydrangeas', 'Gentle bouquet of hydrangeas is indescribably beautiful', 45, 12);
select insVals('Alstroemerias', 'Particoloured alstromerie', 22, 19);
select insVals('Pink roses', 'Beautiful bouquet of pink roses', 27, 91);

select title, description, price, count from products p2 
inner join stocks s2 on p2.id = s2.product_id 

DELETE from stocks
DELETE from products
