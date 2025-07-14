export function transformRoomData(roomData) {
  // Normalize need strings to lowercase keys expected by magic box
  const needs = Array.isArray(roomData.roomType)
    ? roomData.roomType.map((n) => n.trim().toLowerCase())
    : [];

  // Build the user object for runMagicBox
  return {
    name: roomData.roomName ?? "",
    budget: Number(roomData.roomBudget) || 0,
    roomDimensions: {
      length: Number(roomData.roomLength) || 0,
      width: Number(roomData.roomWidth) || 0,
    },
    needs,
  };
}
