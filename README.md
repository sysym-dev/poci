# Todo Node

Todo API Code

## Backlog

### Task Category Resource

Attributes:

- name (required)
- description (nullable)
- tasks_count (computed)
- tasks_done_count (computed)

Filters:

- name (like)
- pagination

Sort:

- id

### Task Resource

Attributes

- name (required)
- description (nullable)
- status (todo, in-progress, done) (default todo)
- task_category_id (nullable)

Filters:

- name (like)
- status (array in)
- task_category_id
- pagination

Sort:

- id
- status

