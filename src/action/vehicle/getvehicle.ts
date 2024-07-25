"use server";

import pool from "@/database/config";
import { ApiResponseType } from "@/model/response";
import { errorToString } from "@/utils/methods";

interface GetVehiclePayload {
  id: string;
}

const GetVehicle = async (
  payload: GetVehiclePayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const result = await pool.query(
      `SELECT tb_vhcl.Id,tb_vhcl.category, tb_vhcl.makeModel, tb_vhcl.vhclNo, tb_vhcl.timeSlot, tb_vhcl.acNonAc, tb_vhcl.year, tb_vhcl.transmission, tb_agent.Id AS agentId, tb_agent.agentName FROM tb_vhcl LEFT JOIN tb_agent ON tb_vhcl.agentId = tb_agent.Id WHERE tb_vhcl.Id = ?;`,
      [payload.id]
    );
    const rows = result[0];

    return {
      status: true,
      data: rows,
      message: "Vehicle data get successfully",
      functionname: "GetVehicle",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetVehicle",
    };
    return response;
  }
};

export default GetVehicle;
