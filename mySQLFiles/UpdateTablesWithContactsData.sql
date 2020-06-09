USE CONTACTS;
CREATE TABLE ALLDATA(
contact_id INT NOT NULL auto_increment primary key,
first_name VARCHAR(25) NOT NULL,
middle_name VARCHAR(25) ,
last_name VARCHAR(25) NOT NULL,
home_phone VARCHAR(15),	
cell_phone VARCHAR(15),	
home_address VARCHAR(80),
home_city	VARCHAR(30) ,
home_state	VARCHAR(20) , 
home_zip INT, 
work_phone	VARCHAR(15),
work_address VARCHAR(80),
work_city	VARCHAR(30) ,
work_state	VARCHAR(20) ,
work_zip	INT ,
birth_date  DATE
);


LOAD DATA LOCAL INFILE '<path>' -- path Contacts.csv
INTO TABLE ALLDATA 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

INSERT INTO CONTACT
 (SELECT contact_id,first_name,middle_name,last_name 
 FROM ALLDATA);
  
  INSERT INTO ADDRESS(contact_id,address_type,address,city,states,zip)
 (SELECT contact_id,"home",home_address,home_city,home_state,home_zip FROM ALLDATA
 WHERE home_address <> "" or home_city <> "" or home_state <> "" or home_zip <> 0 );

 INSERT INTO ADDRESS(contact_id,address_type, address,city,states,zip)
 (SELECT contact_id,"work", work_address,work_city,work_state,work_zip 
  FROM ALLDATA 
  WHERE work_address <> "" or work_city <> "" or work_state <> "" or work_zip <> 0 );
  
  
 INSERT INTO DATES(contact_id,date_type, date_value)
 (SELECT contact_id,"birth",birth_date 
  FROM ALLDATA 
  WHERE birth_date <> '1000-01-01' );
  
   
insert into PHONE(contact_id,phone_type,area_code,phone_num)
(Select contact_id,"home",substring(home_phone, 1 , 3) , concat(substring(home_phone, 5 , 3),substring(home_phone, 9 , 4))
 from ALLDATA where home_phone <> "")
 UNION
 (Select contact_id,"cell",substring(cell_phone, 1 , 3), concat(substring(cell_phone, 5 , 3),substring(cell_phone, 9 , 4))
 from ALLDATA where cell_phone <> "")
 UNION
 (Select contact_id,"work",substring(work_phone, 1 , 3),concat(substring(work_phone, 5 , 3),substring(work_phone, 9 , 4))
 from ALLDATA where work_phone <> "");
