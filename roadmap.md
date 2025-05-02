Detailed Roadmap for AI (Vercel Focused)

**(Phase 1: Core Layout & Status Display - Based on `roadmap.md` Phase 1)**

* **1.1: Theme Integration:**
    * Update `tailwind.config.js` with the "Walnut & Willow" palette from `color_palette.md`.
    * Update `globals.css` to define the corresponding CSS variables for the palette.
    * Apply base background colors (`onyx-bg`) and default text colors (`text-primary-on-dark`) in `app/layout.tsx`.
* **1.2: Main Layout Structure:**
    * Refactor `app/layout.tsx` and `app/page.tsx`.
    * Implement a main layout using `shadcn/ui`'s `ResizablePanelGroup` or similar:
        * A collapsible sidebar (using `charcoal-surface` or `dark-walnut` background). Consider using a Client Component for the resizable/collapsible logic if needed.
        * A main content area (using `ivory-paper` background). This can be a Server Component initially.
    * Add a simple header component (optional, could use `charcoal-surface`).
* **1.3: Enhance `ServerList` Component:**
    * Place `ServerList` inside the sidebar panel. Make it a Client Component (`'use client'`) as it involves state and user interaction.
    * Fetch server list by calling the *internal* Next.js API route `/api/servers` (using `Workspace` or `serverApi.ts`) on mount (`useEffect`).
    * Style the list using the new palette (e.g., hover states using `slate-interactive` on the dark sidebar).
    * For each server, display its name (`ServerConfig.name`).
    * Add a small status indicator icon (e.g., a dot) next to each server name. Its color should initially be neutral.
    * Implement state management (`useState`) in the parent component (`app/page.tsx` or a dedicated client layout component) to track the `selectedServerId`. Update this state when a server is clicked. Highlight the selected server.
    * Implement loading and error states for the server list fetch call.
* **1.4: Enhance `ServerStatusDisplay` Component:**
    * Place this component in the main content area. It can be a Client Component or receive data fetched by a parent Server Component.
    * It should receive `selectedServerId` as a prop.
    * When `selectedServerId` changes (and is not null), fetch the specific server's status by calling the *internal* Next.js API route `/api/servers/[serverId]/status` (using `Workspace` or `serverApi.ts`).
    * **Status Indicator Update:** Update the status indicator dot in the `ServerList` based on the success/failure of this fetch. This might involve lifting state up or using `useContext`.
    * Display loading and error states clearly within the main panel (e.g., using `shadcn/ui` Skeleton).
    * On successful fetch:
        * Display Interface Details: Show `name`, `publicKey`, `listenPort` from the `status.status` object, styled within a `shadcn/ui` `Card` using `parchment-card` background and `stone-border-light`.
        * Display Peers Table: Use a `shadcn/ui` `Table` to display the `status.status.peers` array.
        * Table Columns: `publicKey`, `endpoint`, `allowedIps` (formatted), `latestHandshake` (formatted using `lib/utils.ts`), `transferRx`, `transferTx` (formatted using `lib/utils.ts`).
        * Style the table and card using the cream/light theme elements (`parchment-card`, `ivory-paper`, `text-primary-on-light`).

**(Phase 2: Peer Management UI - Based on `roadmap.md` Phase 2)**

* **2.1: Peer Action Buttons:**
    * In the `ServerStatusDisplay` component (ensure it's a Client Component), add an "Add Peer" button (use `willow-green-primary`).
    * In the Peers `Table`, add a "Remove" button column for each peer (use `error-rose` or an outline variant).
* **2.2: Add Peer Dialog:**
    * Create a new Client Component `AddPeerDialog.tsx`.
    * Use `shadcn/ui` `Dialog`, `Input`, `Label`, `Button`.
    * Trigger this dialog from the "Add Peer" button.
    * Include an input field for "Peer Description".
    * On submit:
        * Call a function (can be defined within the component or in `serverApi.ts`) that makes a POST request to the *internal* Next.js API route `/api/servers/[serverId]/peers` (This internal API route needs creation/implementation to proxy to the backend). Pass the description.
        * Handle loading state on the submit button.
        * On success: Close the dialog, show a success notification/toast, and trigger a refresh of the server status data in `ServerStatusDisplay` (e.g., using React Query/SWR mutation or a simple refetch function).
        * On error: Display an error message within the dialog.
* **2.3: Remove Peer Confirmation:**
    * When the "Remove" button in the peers table is clicked:
        * Show a `shadcn/ui` `AlertDialog` to confirm the action.
        * On confirmation: Call a function that makes a DELETE request to the *internal* Next.js API route `/api/servers/[serverId]/peers/[peerPublicKey]` (Internal API route needs creation/implementation). Pass the correct `serverId` and `peerPublicKey`.
        * Handle loading state.
        * On success: Close the dialog, show success notification, refresh server status data.
        * On error: Show error notification.
* **2.4: (Stretch Goal/Future) Client Config UI:**
    * Add "Get Config" / "Show QR" buttons to the peer table rows.
    * Implement logic to interact with corresponding *internal* Next.js API routes which will proxy to the backend config generation endpoints (Tasks 2.6).

---

### 4. Rules for AI Development (Vercel Specific)

1.  **Code Location:** All frontend code modifications must occur within the `wg-dashboard-frontend` directory. Do NOT modify the `wg-dashboard-backend` code.
2.  **Language & Style:** Use TypeScript exclusively. Adhere to the existing code style and conventions. Use functional components with React Hooks. Prefer Server Components where possible for non-interactive parts, use Client Components (`'use client'`) for interactivity and hooks like `useState`, `useEffect`.
3.  **UI Components:** Primarily use `shadcn/ui` components. Install them as needed (`npx shadcn-ui@latest add [component]`).
4.  **Styling:** Use Tailwind CSS utility classes. Integrate and apply the "Walnut & Willow" color palette via CSS variables defined in `globals.css` and referenced in `tailwind.config.js`.
5.  **API Interaction (Vercel Specific):**
    * Frontend components **must** interact with the backend via the Next.js API routes located in `src/app/api/`.
    * **Do not** call the `NEXT_PUBLIC_MANAGEMENT_BACKEND_URL` directly from client components. All calls go through `/api/...`.
    * The Next.js API routes (`src/app/api/.../route.ts`) are responsible for securely calling the actual backend using the `MANAGEMENT_BACKEND_API_KEY`.
6.  **Environment Variables (Vercel Specific):**
    * Use `process.env.MANAGEMENT_BACKEND_API_KEY` (server-side only) within the Next.js API routes (`src/app/api/...`). This key must be configured in Vercel's project settings and **must not** be prefixed with `NEXT_PUBLIC_`.
    * Use `process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL` (server-side only) within the Next.js API routes to know where to proxy requests.
7.  **State Management:** Use standard React hooks (`useState`, `useEffect`, `useContext`). For server state caching/refetching (like server lists and status), consider using `Workspace` with cache tags or investigate adding SWR/React Query if complexity increases significantly (ask first).
8.  **Types:** Strictly adhere to the TypeScript types defined in `src/types/wireguard.ts`.
9.  **Error Handling:** Implement robust loading states (e.g., `shadcn/ui` Skeleton, spinners) and user-friendly error messages (e.g., `shadcn/ui` Alert, Toast) for all API interactions. Handle errors both in the API routes and in the client components.
10. **Responsiveness & Performance:** Ensure the dashboard is responsive. Be mindful of Vercel's serverless function limitations when designing API routes.
11. **Incremental Development:** Follow the Roadmap steps sequentially. Confirm functionality before proceeding.
12. **Functionality & Clarity:** Ensure UI elements are interactive, provide clear visual feedback, and the overall dashboard is easy to understand and navigate.
13. **Vercel Deployment:** Keep code compatible with Vercel deployment. Check Vercel build and function logs for debugging if issues arise after deployment.

---