## 실행 순서

1. yarn install
2. docker-compose up -d
3. yarn migration:dev:generate src/database/migrations/dev/First
4. yarn migration:dev:run
5. yarn start:dev 혹은 yarn start:prod
6. src/space-room.postman_collection.json를 import하여 사용

---

### TODO

0.  누락된 usecase, repository, manager에 대한 단위 테스트 추가
1.  댓글 : 생성,수정,삭제 \
    게시글 : 수정 삭제 조회

        위 기능들에 대해 디버깅

2.  누락된 특수경우에 대한 예외처리
3.  domain간의 상호작용 최적화
4.  orm의 join를 활용해 쿼리 수 최적화

---

ERD

```mermaid
erDiagram
    User ||--o{ UserRole : ""
    UserRole }o--|| Space : ""
    UserRole }o--|| SpaceRole : ""
    Space ||--o{ SpaceRole : ""
    User ||--o{ Post : "author"
    Post ||--o{ Chat : "Chats"

    User ||--o{ Space : ""
    User ||--o{ Chat : "author"

    Space ||--o{ SpaceEntryCode : ""
    SpaceRole ||--o{ SpaceEntryCode : ""


    User {
        binary id PK
        varchar email
        varchar first_name
        varchar last_name
        varchar profile_picture
    }

    Space {
        binary id PK
        varchar name
        varchar logo
        binary owner_id FK
    }

    SpaceRole {
        binary id PK
        binary space_id FK
        varchar name
        boolean is_admin
    }

    SpaceEntryCode {
        binary id
        binary space_id
        binary role_id
        varchar code
    }

    UserRole {
        binary id PK
        binary user_id FK
        binary space_id FK
        binary role_id FK
    }

    Post {
        binary id PK
        binary space_id FK
        binary author_id FK
        boolean is_anonymous
        boolean is_notice
        varchar title
        text content
        int totalComments
        int totalParticipants
        timestamp created_at
        timestamp updated_at
    }

    Chat {
        binary id PK
        binary post_id FK
        binary author_id FK
        binary parent_id
        boolean is_anonymous
        text content
        timestamp created_at
        timestamp updated_at
    }
```
