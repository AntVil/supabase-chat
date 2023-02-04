# supabase-chat

### Account deletion
When a user deletes their profile it automatically deletes their account aswell using a trigger
```sql
CREATE OR REPLACE FUNCTION deleteUser() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM auth.users WHERE auth.users.id = OLD.user_id;
    RETURN OLD;
END $$ LANGUAGE 'plpgsql';

CREATE TRIGGER deleteUserTrigger 
    AFTER DELETE
ON public.profiles
FOR EACH ROW 
    EXECUTE PROCEDURE deleteUser();
```
