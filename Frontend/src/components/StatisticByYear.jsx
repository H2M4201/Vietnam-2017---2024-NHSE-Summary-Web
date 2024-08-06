import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StatisticByYear({ user }) {
  return (
    <>
      <div className="container px-5 py-3 my-4">
        <h1 className="text-center">Active Events</h1>
      </div>
    </>
  );
}

export default StatisticByYear;

