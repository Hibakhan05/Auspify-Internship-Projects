# clareo.

Landing page + private workspace. React 18, Tailwind 3, GSAP ScrollTrigger, localStorage.

#live demo : https://clareo-tomakeclear.netlify.app/


## What is inside

Landing: scroll drawn hero grid, exploded stack, time loops, record timeline, and the live injection
hook (type an objective, it flies into the top plate of the stack, then the signup modal opens).

Auth: client side mock. Accounts and sessions live in localStorage.

Workspace (sidebar: Workspace, One Thing Mode, Calendar, Logs, Logout):
- Task weights (Light, Medium, Heavy) with a focus prompt when a day holds two heavy tasks
- Your year as one line (built from completion timestamps)
- One Thing Mode (sidebar or the F key, Esc leaves): one task, a hairline that draws as the timer, task completes itself
- Close the day (Carry Forward or Release)
- Calendar (month and week), Logs, clarity index and streak

## localStorage keys

- `clareo.users.v1` accounts
- `clareo.session.v1` active session
- `clareo.tasks.<userId>` tasks
- `clareo.closed.<userId>` last day closed
- `clareo.ui.sidebar`, `clareo.focus.minutes` interface preferences

Auth is a client side mock for demonstration only.
