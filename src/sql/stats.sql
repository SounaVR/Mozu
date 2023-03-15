CREATE TABLE IF NOT EXISTS stats (
    uuid bigint PRIMARY KEY,
	userid bigint,

    cmd bigint,
    HR bigint,
    daily bigint,
    rep bigint
) 