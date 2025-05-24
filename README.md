# TaskFlow - Todo Manager Web Application

A beautiful and intuitive todo management application built with React, Express, and MySQL.

## Features

- Create, edit, update, and delete tasks
- Filter tasks by status (All, Active, Completed)
- Search functionality to quickly find specific tasks
- Priority levels (Low, Medium, High)
- Due date assignment and sorting
- Responsive design for all devices

## Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: MySQL
- **Additional**: Axios for API requests, Date-fns for date manipulation

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL database

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

2. Install dependencies:
```
npm install
```

3. Configure the MySQL connection in `server/index.js`:
```js
const dbConfig = {
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'todo_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
```

4. Start the development server:
```
npm run dev
```

5. In a separate terminal, start the backend server:
```
npm run server
```

## Usage

- Click the "Add Task" button to create a new task
- Use the search box to find specific tasks
- Filter tasks by status using the filter buttons
- Sort tasks by due date, priority, or creation date
- Click on the checkbox to mark a task as complete
- Use the edit and delete buttons to modify or remove tasks

## License

MIT