import {executeQuery} from "../database/database.js";

const create = async (sender,message) => {
    await executeQuery(
      "INSERT INTO addresses (sender, message) VALUES ($sender, $message);",
      { sender: sender, message: message },
    );
  };
  
  const deleteById = async (id) => {
    await executeQuery("DELETE FROM messages WHERE id = $id;", { id: id });
  };
  
  const findAll = async () => {
    let result = await executeQuery("SELECT * FROM messages ORDER BY id DESC LIMIT 5;");
    return result.rows;
  };
  
  const findByNameOrAddressLike = async (nameOrAddress) => {
    const likePart = `%${nameOrAddress}%`;
  
    let result = await executeQuery(
      "SELECT * FROM messages WHERE name ILIKE $namePart OR address ILIKE $addressPart;",
      { namePart: likePart, addressPart: likePart },
    );
  
    return result.rows;
  };
  
  export { create, deleteById, findAll, findByNameOrAddressLike };