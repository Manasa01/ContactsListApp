# ContactsListApp
Contacts List creation, modification, deletion and display (CRUD operation on Contacts data)

The Contact List application is built using Angular as GUI, Node.js with Express.js as
REST API builder and mySQL as the database.
There are three subfolders for Angular Frontend, Node.js backend and mySQL database named as below:
- AngularFrontend
- NodeBackend
- mySQLFiles

### Installation Steps
1. Installation of software dependencies
   - Install Node.js and npm
   - Install Angular
   - Install mySQL
2. Create database and insert Contacts.csv data in mySQL
3. Launch the Node.js backend
4. Launch the Angular frontend

## Installation of software dependencies
### Install Node.js and npm
1. Download Node.js using the link for version 12.16.1:
https://nodejs.org/en/download/
2. Open command prompt or terminal and type the command ‘node -v’ to verify
successful installation
Note: The version must be 12.16.1 or higher
3. Type the command ‘npm -v’ to verify successful installation
Note: The version must be 6.13.4 or higher
### Install Angular
1. On successful installation of npm, open the command prompt or terminal and
type
 In Windows: npm install -g @angular/cli
 In Linux OS/Mac: sudo npm install -g @angular/cli
2. Type the command ‘ng version’ to verify successful installation
 Use version 6.0.0 or higher
### Install mySQL
1. Install mySQL Server or Workbench using this link:
https://dev.mysql.com/downloads/
 Use version 6.3.18 or above for workbench
 Use version 5.7.29 or above for mySQL server
2. On successful installation, open the command prompt or terminal, start the
database service using the command ‘mysqld --console’
3. Open a new command prompt or terminal, and Login as root user with the
command ‘mysql -u root -p’
4. Create a user to connect with Node.js program. Run the command:
CREATE USER ‘contactsuser’@’localhost’ IDENTIFIED BY ‘contacts_password’;
Keep this terminal/command prompt open for the reason: After creation of
database and insertion of records (as shown in next step) grant database
permission to this user (will be described subsequently)

## Create database and insert Contacts.csv data in mySQL
1. In Contacts.csv file, for all the records with blank space in Zip code and Date
value, replace the blank space for Zip code with 0 and Blank space for Date
value with 1000-01-01 and save the file.
2. Include the Contacts.csv file path in UpdateTablesWithContactsData.sql (in
mySQLFiles folder)
Copy the path to Contacts.csv file and paste it in the <path> placeholder in the
line: LOAD DATA LOCAL INFILE ‘<path>’ and save it.
3. Execute the ContactsDBCreation.sql file in the mySQL console or mySQL
workbench. This will create the CONTACTS database.
4. In the command prompt/terminal for mysql (logged in using root user), grant all
privileges to contactsuser and give mysql_native_password option using the
commands:
GRANT ALL PRIVILEGES ON CONTACTS.* TO 'contactsuser'@'localhost';
ALTER USER ‘contactsuser’@’localhost’ IDENTIFIED WITH
mysql_native_password BY ‘contacts_password’ ;
5. Execute the UpdateTablesWithContactsData.sql in the mySQL console or
mySQL workbench. This will insert the data from CONTACTS.csv to CONTACTS
database.
  
## Launch the Node.js backend
1. Open the command prompt or Terminal in the NodeBackend folder
2. Execute the command ‘npm install’ to install all the dependencies for the Node.js
folder
3. On successful installation, execute the command ‘node server.js’
4. Open the browser and execute the link “http://localhost:3000/” , if you get the
message “Welcome!” , the backend is launched successfully

## Launch the Angular frontend
1. Open the command prompt or Terminal in the AngularFrontend folder
2. Execute the command ‘npm install’ to install all the dependencies for the Node.js
folder
3. On successful installation, execute the command ‘ng serve’
4. Open the browser and execute the link “http://localhost:4200/”
The application is ready for use!
