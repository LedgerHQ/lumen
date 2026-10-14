# MCP servers

The servers in `.mcp.json` (Claude Code) and `.cursor/mcp.json` (Cursor) are
shared with everyone working in this repo, and most of them only need a browser
sign-in on first use. This page covers the ones that need a one-time setup on
your machine.

## Google Sheets

Read-only access to the Google Sheets you can open (`spreadsheets.readonly`),
through Google's official server, `https://sheetsmcp.googleapis.com/mcp/v1`.

It doesn't support dynamic client registration, so it uses a shared OAuth
client. Get its client ID and secret from the team vault and keep them out of
the repo: it is public.

**Cursor**: export both values where Cursor picks up your environment (e.g.
`~/.zshrc`), then restart Cursor and enable `google-sheets` in its MCP settings.

```bash
export GOOGLE_SHEETS_MCP_CLIENT_ID="<client-id>"
export GOOGLE_SHEETS_MCP_CLIENT_SECRET="<client-secret>"
```

**Claude Code**: it can only store a client secret when you add a server, so the
server is not in `.mcp.json`. Add it once for all your projects; it prompts for
the secret and keeps it in your keychain:

```bash
claude mcp add-json google-sheets --scope user --client-secret '{"type":"http","url":"https://sheetsmcp.googleapis.com/mcp/v1","oauth":{"clientId":"<client-id>","callbackPort":8787,"scopes":"https://www.googleapis.com/auth/spreadsheets.readonly"}}'
```

Then run `/mcp` and sign in with your Ledger Google account. Both tools redirect
to `http://localhost:8787/callback`, the URI registered on the OAuth client.
