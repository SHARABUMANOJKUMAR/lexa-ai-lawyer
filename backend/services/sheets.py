import gspread
import os
from google.oauth2.service_account import Credentials

# Define the scopes
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

# Provide your actual Google Sheet ID here
SPREADSHEET_ID = os.getenv("GOOGLE_SHEET_ID", "YOUR_GOOGLE_SHEET_ID_HERE")

class GoogleSheetsService:
    def __init__(self):
        self.client = None
        self.spreadsheet = None
        self._initialize()

    def _initialize(self):
        try:
            # Requires a service_account.json in the backend root
            if os.path.exists("service_account.json"):
                creds = Credentials.from_service_account_file('service_account.json', scopes=SCOPES)
                self.client = gspread.authorize(creds)
                self.spreadsheet = self.client.open_by_key(SPREADSHEET_ID)
            else:
                print("Warning: service_account.json not found. Google Sheets integration disabled.")
        except Exception as e:
            print(f"Failed to initialize Google Sheets: {e}")

    def _get_or_create_worksheet(self, title, headers=None):
        if not self.spreadsheet:
            return None
        try:
            return self.spreadsheet.worksheet(title)
        except gspread.exceptions.WorksheetNotFound:
            worksheet = self.spreadsheet.add_worksheet(title=title, rows="1000", cols="20")
            if headers:
                worksheet.append_row(headers)
            return worksheet

    def append_case(self, case_data: dict):
        ws = self._get_or_create_worksheet("Cases", ["Case ID", "User ID", "Title", "Status", "Date"])
        if ws:
            ws.append_row([
                case_data.get("id", ""),
                case_data.get("user_id", ""),
                case_data.get("title", ""),
                case_data.get("status", "Active"),
                case_data.get("date", "")
            ])

    def get_stats(self):
        # A mock implementation returning stats based on sheets
        if not self.spreadsheet:
             return {"total_users": 0, "active_cases": 0, "resolved_cases": 0}
        
        try:
            cases_ws = self.spreadsheet.worksheet("Cases")
            all_cases = cases_ws.get_all_records()
            active = len([c for c in all_cases if c.get("Status") == "Active"])
            resolved = len([c for c in all_cases if c.get("Status") == "Resolved"])
            return {
                "total_users": 0, # Depending on how you track users
                "active_cases": active,
                "resolved_cases": resolved
            }
        except Exception:
            return {"total_users": 0, "active_cases": 0, "resolved_cases": 0}

sheets_service = GoogleSheetsService()
