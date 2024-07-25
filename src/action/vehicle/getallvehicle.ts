"use server";

import pool from "@/database/config";
import { ApiResponseType } from "@/model/response";
import { errorToString } from "@/utils/methods";

interface GetAllVehiclePayload {}

const GetAllVehicle = async (
  payload: GetAllVehiclePayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const result = await pool.query(
      `SELECT tb_vhcl.Id,tb_vhcl.category, tb_vhcl.agentId, tb_vhcl.makeModel, tb_vhcl.vhclNo, tb_vhcl.timeSlot, tb_vhcl.acNonAc, tb_vhcl.year, tb_vhcl.transmission, tb_agent.agentName FROM tb_vhcl LEFT JOIN tb_agent ON tb_vhcl.agentId = tb_agent.Id;`
    );
    const rows = result[0];

    return {
      status: true,
      data: rows,
      message: "Vehicle data get successfully",
      functionname: "GetAllVehicle",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllVehicle",
    };
    return response;
  }
};

export default GetAllVehicle;
