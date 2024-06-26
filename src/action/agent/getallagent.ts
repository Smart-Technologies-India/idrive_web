"use server";

import pool from "@/database/config";
import { ApiResponseType } from "@/model/response";
import { errorToString } from "@/utils/methods";

interface GetAllAgentPayload {}

const GetAllAgent = async (
  payload: GetAllAgentPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const result = await pool.query(
      `SELECT tb_agent.*, tb_rto.rtoCode, tb_rto.rtoName FROM tb_agent LEFT JOIN tb_rto ON tb_agent.rtoId = tb_rto.Id;`
    );
    const rows = result[0];

    return {
      status: true,
      data: rows,
      message: "Agent data get successfully",
      functionname: "GetAllAgent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllAgent",
    };
    return response;
  }
};

export default GetAllAgent;
