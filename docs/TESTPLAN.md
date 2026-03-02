    # COBOL Account Management System Test Plan

This test plan captures the current business logic and implementation behavior of the COBOL application (`MainProgram`, `Operations`, `DataProgram`) and is intended for stakeholder validation before and during Node.js modernization.

## Scope Covered

- Menu-based user flow (View Balance, Credit, Debit, Exit, Invalid choice)
- Account balance retrieval and update behavior
- Credit and debit calculations
- Insufficient funds handling
- State persistence behavior while the program is running

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Verify main menu is displayed with all options | Application is started | 1. Launch program.<br>2. Observe initial screen. | Menu displays:<br>- Account Management System<br>- 1. View Balance<br>- 2. Credit Account<br>- 3. Debit Account<br>- 4. Exit<br>- Prompt to enter choice (1-4). | TBD | TBD | Baseline UI flow validation. |
| TC-002 | Verify View Balance (option 1) returns current balance | Application is started; no prior balance update in current run | 1. Enter menu choice `1`.<br>2. Observe output. | System calls read operation and displays: `Current balance: 1000.00` (initial value). | TBD | TBD | Confirms initial balance read behavior. |
| TC-003 | Verify Credit operation increases balance | Application is started; current balance known (e.g., 1000.00) | 1. Enter menu choice `2`.<br>2. Enter credit amount `250.50`.<br>3. Observe output.<br>4. Enter menu choice `1` to verify persisted balance. | Credit amount is added to current balance.<br>Output after credit: `Amount credited. New balance: 1250.50`.<br>View Balance then shows `Current balance: 1250.50`. | TBD | TBD | Validates READ -> ADD -> WRITE flow in Operations/DataProgram. |
| TC-004 | Verify Debit operation decreases balance when sufficient funds exist | Application is started; set/confirm balance is 1000.00 | 1. Enter menu choice `3`.<br>2. Enter debit amount `200.00`.<br>3. Observe output.<br>4. Enter menu choice `1` to verify persisted balance. | Debit amount is subtracted from current balance.<br>Output after debit: `Amount debited. New balance: 800.00`.<br>View Balance then shows `Current balance: 800.00`. | TBD | TBD | Validates READ -> SUBTRACT -> WRITE flow. |
| TC-005 | Verify Debit operation blocks transaction when funds are insufficient | Application is started; set/confirm balance is 1000.00 | 1. Enter menu choice `3`.<br>2. Enter debit amount `1500.00`.<br>3. Observe output.<br>4. Enter menu choice `1` to verify balance unchanged. | System displays `Insufficient funds for this debit.`<br>No write occurs; balance remains `1000.00`. | TBD | TBD | Critical business rule: no negative balance allowed by current implementation. |
| TC-006 | Verify invalid menu input is handled | Application is started | 1. Enter menu choice `9` (or any value outside 1-4).<br>2. Observe output.<br>3. Confirm menu appears again. | System displays: `Invalid choice, please select 1-4.`<br>Application continues loop and re-displays menu. | TBD | TBD | Confirms error handling and loop continuation. |
| TC-007 | Verify Exit option stops loop and ends program | Application is started | 1. Enter menu choice `4`.<br>2. Observe output and program termination. | Continue flag set to `NO`.<br>System displays: `Exiting the program. Goodbye!`<br>Program terminates. | TBD | TBD | Validates graceful termination path. |
| TC-008 | Verify multiple sequential transactions preserve in-memory balance during runtime | Application is started | 1. Enter `2`, credit `100.00`.<br>2. Enter `3`, debit `40.00`.<br>3. Enter `1` to view balance. | Final balance should be `1060.00` (from 1000.00 + 100.00 - 40.00).<br>Demonstrates state persistence across operations in same run. | TBD | TBD | Important for integration parity in Node.js migration. |
| TC-009 | Verify debit equal to current balance results in zero balance | Application is started; set/confirm balance is 1000.00 | 1. Enter menu choice `3`.<br>2. Enter debit amount `1000.00`.<br>3. Observe output.<br>4. Enter menu choice `1`. | Debit is allowed when amount equals balance.<br>Output after debit: `Amount debited. New balance: 0.00`.<br>View Balance shows `Current balance: 0.00`. | TBD | TBD | Boundary test for comparison `FINAL-BALANCE >= AMOUNT`. |
| TC-010 | Verify zero credit amount is accepted and leaves balance unchanged | Application is started; set/confirm balance is 1000.00 | 1. Enter menu choice `2`.<br>2. Enter credit amount `0.00`.<br>3. Observe output.<br>4. Enter menu choice `1`. | System processes transaction.<br>Output: `Amount credited. New balance: 1000.00`.<br>Balance remains unchanged. | TBD | TBD | Documents current behavior for zero-value input. |
| TC-011 | Verify zero debit amount is accepted and leaves balance unchanged | Application is started; set/confirm balance is 1000.00 | 1. Enter menu choice `3`.<br>2. Enter debit amount `0.00`.<br>3. Observe output.<br>4. Enter menu choice `1`. | Condition `balance >= amount` passes.<br>Output: `Amount debited. New balance: 1000.00`.<br>Balance remains unchanged. | TBD | TBD | Documents current behavior for zero-value input. |
| TC-012 | Verify application starts with default balance each new program run | Run A completed with altered balance (e.g., after credit/debit), then application restarted | 1. In Run A, change balance (e.g., credit 500.00).<br>2. Exit program.<br>3. Restart application (Run B).<br>4. Enter menu choice `1`. | On a fresh run, balance is reset to initial `1000.00` due to in-memory `STORAGE-BALANCE` initialization. | TBD | TBD | Important migration note: no persistent external datastore in current COBOL logic. |

## Notes for Node.js Modernization Parity

- Preserve exact business rules first (including edge-case handling) to ensure behavioral parity before introducing enhancements.
- Keep expected output messages aligned where possible for easier regression comparison.
- Use this table as the source for future unit tests (operation-level) and integration tests (menu + operation + data flow).
