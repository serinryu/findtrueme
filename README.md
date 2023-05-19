API

[global routers]
/ -> Home
/join -> Join
/login -> Login 

[user routers]
GET /users/{:id}
PATCH /users/{:id} -> delete user
GET /users/{:id}/edit -> edit user form
PUT /users/{:id}/edit -> edit user
POST /users/{:id}/follow  -> follow or unfollow user

[posts routers]
GET /posts 
GET /posts/search -> search
GET /posts/upload -> upload post form
POST /posts/upload -> upload post
GET /posts/{:id} -> detail 
PATCH /posts/{:id} -> delete post
GET /posts/{:id}/edit -> edit post form
PUT /posts/{id}/edit -> edit post
POST /posts/{:id}/like -> like or unlike post
GET /posts/hashtag/{:hashtag} -> Hashtag posts

[comments routers]
POST /comments
PUT /comments/{:id} -> edit comment
PATCH /comments/{:id} -> delete comment
POST /comments/{:id}/like -> like comment

