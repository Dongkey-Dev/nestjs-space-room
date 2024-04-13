```mermaid
erDiagram
    User ||--o{ UserRole : ""
    UserRole }o--|| Space : ""
    Space ||--o{ SpaceRole : ""
    User ||--o{ Post : "author"
    Post ||--o{ Chat : "Chats"

    User ||--o{ Space : ""
    User ||--o{ Chat : "author"


    User {
        int id PK
        varchar email
        varchar first_name
        varchar last_name
        varchar profile_picture
    }

    Space {
        int id PK
        varchar name
        varchar logo
        int owner_id FK
    }

    SpaceRole {
        int id PK
        int space_id FK
        varchar name
        boolean is_admin
    }

    UserRole {
        int id PK
        int user_id FK
        int space_id FK
        int role_id FK
    }

    Post {
        int id PK
        int space_id FK
        int author_id FK
        boolean is_anonymous
        boolean is_notice
        varchar title
        text content
        timestamp created_at
        timestamp updated_at
    }

    Chat {
        int id PK
        int post_id FK
        int author_id FK
        int parent_id
        boolean is_anonymous
        text content
        timestamp created_at
        timestamp updated_at
    }
```
