CREATE TABLE IF NOT EXISTS stats (
    uuid bigint PRIMARY KEY AUTO_INCREMENT,
	userid bigint,

    cmd bigint,
    HR bigint,
    daily bigint,
    rep bigint
) 