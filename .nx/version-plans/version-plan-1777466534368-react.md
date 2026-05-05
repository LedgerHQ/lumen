---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(ui-react): update Avatar + DotIndicator sizes

- <Avatar size="sm" />   {/* was 40px */}
+ <Avatar size="md" />   {/* now 40px */}

- <Avatar size="md" />   {/* was 48px */}
+ <Avatar size="lg" />   {/* now 48px */}

- <Avatar size="lg" />   {/* was 72px — no 72px token anymore */}
+ <Avatar size="xl" />   {/* 64px — closest larger row; confirm with design if you need 72px */}


- <DotIndicator size="md" />
+ <DotIndicator size="lg" />
