# Peloton stats

- `yarn`
- `yarn start`

### To do

- parse out records for ride length
- filter by fitness discipline

### Notes

Scrape the workouts CSV

```
const req = await fetch('https://api.onepeloton.com/api/user/<user_id>/workout_history_csv', {credentials: 'include'})
const data = await resp.text();
```

built with trav_boilerplate (`npx trav_boilerplate <project directory>`)
