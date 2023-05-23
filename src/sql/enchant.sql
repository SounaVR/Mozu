CREATE TABLE IF NOT EXISTS enchant (
    uuid bigint PRIMARY KEY AUTO_INCREMENT,
	userid bigint,

    ench_pickaxe bigint,
	ench_sword bigint,
    ench_shield bigint,
	ench_head bigint,
	ench_shoulders bigint,
	ench_chest bigint,
	ench_wrists bigint,
	ench_hands bigint,
	ench_waist bigint,
    ench_legs bigint,
	ench_feet bigint
) 