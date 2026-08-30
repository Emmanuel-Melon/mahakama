1. Detailed Wireframe-Style Description of the Matter Page

Client (User) View

Header (sticky)
Left: Back button
Center: Matter title (editable via pencil icon)
Right: Status badge (e.g. Open, In Progress, Waiting on Lawyer, Resolved)
Primary action button: Request Lawyer / Share with Lawyer (changes based on state)

Summary Section
AI-generated summary (2–4 sentences)
Small “Edit” link
Key metadata chips: Jurisdiction • Practice Area • Urgency
Created date + “Opened from chat” link

Main Content – Tabbed or Sectioned
Timeline (default tab)
   Vertical timeline, newest at top
   Each item: Icon + Title + Short description + Relative time + Actor (“You” or Lawyer name)
   Examples: “Matter opened”, “Note added”, “Document uploaded”, “Lawyer accepted”, “Status changed to In Progress”

Documents
   List of uploaded files with name, size, uploader, date
   Upload button (prominent)

Notes
   Only public notes visible
   “Add a note” input at top

Lawyers
   Cards of assigned lawyers (photo/initials, name, role, status)
   Empty state: “No lawyer assigned yet”

Secondary
Collapsible “Original Conversation” section (see section 3 below)
Footer actions (mobile): Add Note • Upload • Share

Lawyer View

Header (sticky)
Same as client + extra status dropdown (lawyer can change status)
Primary button: Update Status or Add Internal Note

Summary Section
Same as client, plus “View full AI analysis” expandable section (key citations, extracted facts)

Main Content
Timeline (default) – shows all activities including internal ones (clearly marked “Internal”)
Documents – same + ability to upload
Notes
   Toggle: “Show internal notes”
   Separate composer: Public note vs Internal note
Lawyers / Team – see other assigned lawyers + role
Events & Reminders (simple list for now)

Strong emphasis on context
Prominent “Original Chat” panel (side panel on desktop, expandable section on mobile)

Quick Actions Bar (desktop) or FAB (mobile)
Add Internal Note
Upload Document
Schedule Reminder
Change Status

2. Exact States & Microcopy for the “Open as Matter” Flow

Trigger Points in Chat
Contextual banner (after meaningful exchange):  
  “Ready to take this further?”  
  Secondary text: “Turn this conversation into a Matter so you can track it, add documents, and connect with a lawyer.”  
  Buttons: Open as Matter (primary) • Not now

Manual: In the chat header “•••” menu → Open as Matter

Step-by-step Flow

State 1 – Confirmation Sheet / Modal
Title: Open as Matter  
Subtitle: “We’ll create a structured record from this conversation.”

Title field (pre-filled, editable)
AI Summary preview (read-only, with “This summary will be saved”)
Optional fields: Jurisdiction (dropdown/suggested), Practice Area
Checkbox: “Also request a lawyer recommendation”
Primary button: Open Matter
Secondary: Cancel

State 2 – Immediate Response (after API call)
Button loading → “Opening Matter…”
Then success toast or full-screen state:  
  “Matter is being prepared”  
  “We’re generating a clear summary and organizing the details. This usually takes a few seconds.”  
  Button: View Matter (disabled or shows spinner) + “You can close this”

State 3 – Job Completed
Push notification / In-app toast:  
  “Your Matter is ready”  
  “We’ve organized your conversation into a Matter.”  
  Button: Go to Matter

Error State
“We couldn’t open the Matter right now. Please try again.”  
  Button: Retry • Close

Empty / Edge Microcopy
If chat is too short: “Add a bit more detail in the chat first so we can create a useful Matter.”

3. How the Original Chat Should Be Displayed Inside the Matter

Goal: Give both client and lawyer full context without leaving the Matter, while keeping the Matter page clean.

Recommended Approach (Hybrid)

Desktop
Right-side collapsible panel (or second column)
Header: Original Conversation + “Opened on [date]” + external link icon (“Open full chat”)
Content: Read-only chat thread (same bubble style as the main chat)
Messages are scrollable
Key AI answers that contain citations are highlighted or have a small “Used in summary” indicator
Search inside the original chat (nice-to-have)

Mobile
Dedicated section or bottom sheet
Collapsed by default showing: “Original conversation • X messages • Tap to view”
Expanded: Full read-only chat thread
Strong “Back to Matter” affordance

Rules
100% read-only (no sending new messages from here in v1)
Preserve the exact message order, timestamps, and citations
Make it obvious this is the source: subtle background difference or label “Source Chat”
Lawyer view can show a “Jump to relevant message” if we later store message anchors in the Matter metadata

Alternative (simpler v1)
Just a clear button/card:  
  View Original Conversation  
  → Opens the original chat in a new screen/modal (read-only mode)  
  This is faster to build and still effective.

Summary of Recommended Priority
Build the “Open as Matter” flow with the microcopy above.
Matter page with strong Timeline + Summary.
Original Chat as a collapsible / viewable section (start with simple “View Original Chat” button if needed).
Differentiate Client vs Lawyer views mainly through permissions (internal notes, status control, full timeline).

