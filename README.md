API

[global routers]
/ -> Home
/join -> Join
/login -> Login 

[user routers]
GET /users/{:id}
POST /users -> create user
POST /users/{:id}/follow  -> follow or unfollow user
PUT /users/{:id} -> edit user
PATCH /users/{:id} -> delete user

[posts routers]
GET /posts 
GET /posts/search -> search
GET /posts/{:id} -> select one post
POST /posts -> create post
POST /posts/{:id}/like -> like or unlike post
PUT /posts/{id} -> edit post
PATCH /posts/{:id} -> delete post

[comments routers]
POST /comments
PUT /comments/{:id} -> edit comment
PATCH /comments/{:id} -> delete comment
POST /comments/{:id}/like -> like comment

