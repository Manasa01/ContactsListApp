/*
 *    File name: ContactsDBCreation.sql
 *       Author: Manasa Bhat
 *    Last Edit: 2020-03-16
 *  Description: This file is based on the CONTACTS database schema.  
 */
 
 -- If the database "COMPANY" already exists, then delete it.
DROP DATABASE IF EXISTS CONTACTS;
-- Create the Database "CONTACTS"
CREATE DATABASE CONTACTS;

-- Set the currently active database to be "COMPANY"
USE CONTACTS;

DROP TABLE IF EXISTS CONTACT;
CREATE TABLE CONTACT(
 contact_id 	INT NOT NULL AUTO_INCREMENT,
 first_name     		VARCHAR(25) NOT NULL, 
 middle_name     		VARCHAR(25),
 last_name     		        VARCHAR(25) NOT NULL, 
 CONSTRAINT pk_Contact_id PRIMARY KEY (Contact_id)
);

DROP TABLE IF EXISTS ADDRESS;
CREATE TABLE ADDRESS(
 address_id 	INT NOT NULL AUTO_INCREMENT,
 contact_id     INT NOT NULL,  
 address_type   VARCHAR(10),
 address        VARCHAR(80),
 city           VARCHAR(30),
 states         VARCHAR(20),
 zip            MEDIUMINT(5),
 CONSTRAINT pk_Address_id PRIMARY KEY (Address_id),
 CONSTRAINT fk_Contact_id FOREIGN KEY (Contact_id) REFERENCES CONTACT(Contact_id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS PHONE;
CREATE TABLE PHONE(
 phone_id      INT NOT NULL AUTO_INCREMENT,
 contact_id    INT NOT NULL,  
 phone_type    VARCHAR(10),
 area_code     SMALLINT(3),
 phone_num     INT,
 CONSTRAINT pk_phone_id PRIMARY KEY (phone_id),
 CONSTRAINT fk_cont_id FOREIGN KEY (contact_id) REFERENCES CONTACT(contact_id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS DATES;
CREATE TABLE DATES(
 date_id 	   INT NOT NULL AUTO_INCREMENT,
 contact_id    INT NOT NULL,  
 date_type     VARCHAR(20),
 date_value    DATE,
 CONSTRAINT pk_Date_id PRIMARY KEY (Date_id),
 CONSTRAINT fk_Contc_id FOREIGN KEY (Contact_id) REFERENCES CONTACT(Contact_id) ON DELETE CASCADE ON UPDATE CASCADE
);


SELECT * FROM CONTACT;
SELECT * FROM ADDRESS;
SELECT * FROM PHONE;
SELECT * FROM DATES;
