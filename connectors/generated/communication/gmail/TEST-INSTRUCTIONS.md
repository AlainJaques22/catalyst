# Conditional Properties Test Instructions

These test templates will help determine if your Camunda setup supports conditional properties.

## Test Files Created

1. **test-conditional-simple.element.json** - Basic conditional test
2. **test-conditional-shared.element.json** - Shared parameter names test

---

## Test 1: Basic Conditional Properties

**File**: `test-conditional-simple.element.json`

**What it tests**: Can we show/hide different parameters based on operation selection?

### Expected Behavior (if conditions work):
1. When **Operation = "Send Message"**:
   - ✅ Shows: "To (SEND ONLY)"
   - ✅ Shows: "Subject (SEND ONLY)"
   - ❌ Hides: "Message ID (GET ONLY)"

2. When **Operation = "Get Message"**:
   - ❌ Hides: "To (SEND ONLY)"
   - ❌ Hides: "Subject (SEND ONLY)"
   - ✅ Shows: "Message ID (GET ONLY)"

### How to Test:
1. Close Camunda Modeler
2. Restart Camunda Modeler
3. Import template: `test-conditional-simple.element.json`
4. Create new BPMN diagram
5. Add Service Task
6. Apply template: "Test - Conditional Properties Simple"
7. **In properties panel**:
   - Check which fields are visible with "Send Message" selected
   - Change Operation dropdown to "Get Message"
   - **Watch if fields change**

### Results:
- ✅ **PASS**: Fields show/hide when you change Operation
- ❌ **FAIL**: All fields visible regardless of Operation selection
  - → **Your Camunda version does NOT support conditional properties**

---

## Test 2: Shared Parameter Names

**File**: `test-conditional-shared.element.json`

**What it tests**: Can multiple properties bind to the same parameter name but show conditionally?

### Expected Behavior (if conditions work):
1. When **Operation = "Send Message"**:
   - ✅ Shows: "To (SEND)"
   - ✅ Shows: "Subject (SEND)"
   - ❌ Hides: "Message ID (REPLY)"
   - ❌ Hides: "Subject (REPLY)"
   - ❌ Hides: "Message ID (GET)"

2. When **Operation = "Reply Message"**:
   - ❌ Hides: "To (SEND)"
   - ❌ Hides: "Subject (SEND)"
   - ✅ Shows: "Message ID (REPLY)"
   - ✅ Shows: "Subject (REPLY)"
   - ❌ Hides: "Message ID (GET)"

3. When **Operation = "Get Message"**:
   - ❌ Hides: "To (SEND)"
   - ❌ Hides: "Subject (SEND)"
   - ❌ Hides: "Message ID (REPLY)"
   - ❌ Hides: "Subject (REPLY)"
   - ✅ Shows: "Message ID (GET)"

### Important Notes:
- **"Subject (SEND)"** and **"Subject (REPLY)"** both bind to `subject` parameter
- **"Message ID (REPLY)"** and **"Message ID (GET)"** both bind to `messageId` parameter
- This tests if the same binding name can appear in different conditions

### How to Test:
1. Import template: `test-conditional-shared.element.json`
2. Apply to Service Task
3. Change Operation dropdown between all 3 options
4. Watch which fields appear/disappear

### Results:
- ✅ **PASS**: Only fields for selected operation are visible
- ❌ **FAIL**: Multiple fields with same binding name cause issues
  - → **Shared parameter names require unique property IDs per operation**

---

## What to Report Back

Please test both templates and tell me:

### For Test 1:
- [ ] Fields show/hide correctly when changing Operation
- [ ] All fields visible all the time (conditions don't work)

### For Test 2:
- [ ] Fields show/hide correctly
- [ ] Fields with same binding name cause problems
- [ ] All fields visible all the time

### Your Camunda Version:
- Modeler version: _______ (Help → About)
- Platform: Camunda 7 or Camunda 8?

---

## Next Steps Based on Results

### If Test 1 FAILS (most likely for Camunda 7):
→ We'll generate **26 individual element templates** (one per operation)
- Each template shows only its specific parameters
- No confusion, perfect UX
- Works in any Camunda version

### If Test 1 PASSES but Test 2 FAILS:
→ We'll ensure unique IDs for all properties and avoid shared bindings

### If Both PASS:
→ The Gmail template should work! Something else is wrong.
