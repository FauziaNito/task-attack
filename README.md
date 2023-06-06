## Problems
- Tracking input field data manually
- Validating data manually
- Tracking state of asynchronous manually ("loading", "success", "error", "idle")
- Tracking changes of data on the server so that it can be refreshed everywhere it's use on the client
  - One part of the client asks the server to make changes/mutations, how do other parts of the client that depend on/query the changed data find out about the changes?