import React, { useState } from "react";

export default function useQuery() {
  const [loading, setLoading] = useState(false);

  const ArrayResult = (data: any[] | undefined) => {
    if (data && Array.isArray(data)) {
      return data;
    }
  
    return []
  }

  const query = async(request: any, failCallback?: Function) => {
    setLoading(true);

    try {
      const result = await request().finally(() => {
        setLoading(false);
      });
      console.log("🚀 ~ file: useQuery.ts:21 ~ result ~ result:", result)

      return ArrayResult(result);
    } catch (error: any) {
      setLoading(false);
      failCallback && failCallback(error);
      return [];
    }
  }

  return {
    loading,
    query
  }
}