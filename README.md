# todo-node

todo node

## API

### GET `/todos` Get All Todos

Query params:

- `page[size]` Pagination size / limit
- `page[number]` Pagination number
- `filter[column]` Filter column
- `sort` Sort columns, separated by `,`, to sort by descending add `-` in char at 0 of the column

### GET `/todos/:id` Get One Todo By Id

### POST `/todos` Create New Todos

Body payload:

- `name` string, required

### PATCH `/todos/:id` Update Todo By Id

Body payload:

- `name` string, optional
- `done_at` datetime, optional

### DELETE `/todos/:id` Delete Todo By Id
