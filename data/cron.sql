select '30 22 * * * /sbin/turnon';
select substr(CIVIL_START,2,1) || ' ' || substr(CIVIL_START,4,2) || ' ' || DAY || ' ' || MONTH || ' * /sbin/turnoff' from daylight_data;