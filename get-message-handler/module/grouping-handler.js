/**
 * Grouping array by user ID
 * @param {object} arr Array to be group
 * @returns Grouped array
 */
async function grouping(arr) {
  const arrLength = arr.length;
  const alreadyExist = [];
  const groupedArray = [];

  return new Promise((resolved, rejected) => {
    arr.reduce((val, current, idx) => {
      //Var
      const obj = {};

      if (!alreadyExist.includes(current.user_id.S)) {
        //Add mark to user ID
        alreadyExist.push(current.user_id.S);
        //Assign to object
        obj.user = current?.user_id?.S;
        obj.name = current?.user_name?.S;
        obj.messages = [current?.message?.S];
        //Add to array
        groupedArray.push(obj);
      } else if (alreadyExist.includes(current.user_id.S)) {
        //Find array index to be update
        const idxToBeUpdate = groupedArray.findIndex((obj) => obj.user === current?.user_id?.S);
        //Add user messages
        groupedArray[idxToBeUpdate]?.messages?.push(current?.message?.S);
        //Update name
        current?.user_name?.S 
            ? groupedArray[idxToBeUpdate].name = current?.user_name?.S
            : null;
      } 
      //Mark as resolved when done
      if (idx === arrLength - 1) {
        resolved(groupedArray);
      }
      return current;
    }, null);
  });
}

module.exports = grouping;
