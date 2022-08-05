import React from "react";
import { Heading, Stack, Text, useToast } from "@chakra-ui/react";
import { toastErrorOptions, toastSuccessOptions } from "../../lib/chakraUtils";
import { AddPlanButton, PlansListEntry } from "./PlansListEntry";
import { usePlans } from "../../lib/firestore/plans";

const PlansList = () => {
  const { plans, add, update, remove } = usePlans();
  const toast = useToast();


  const addPlan = (
    name: string, programme_id: string, chosen_major_id: string, chosen_minor_id: string, notes?: string) => {
    add({ name, programme_id, chosen_major_id, chosen_minor_id, notes })
      .then(() => toast(toastSuccessOptions("Successfully added plan")))
      .catch(() => toast(toastErrorOptions("Failed to add plan")));
  }

  const updatePlan = (planId: string) => (
    name: string, programme_id: string, chosen_major_id: string, chosen_minor_id: string, notes?: string) => {
    update({ id: planId, name, programme_id, chosen_major_id, chosen_minor_id, notes })
      .then(() => toast(toastSuccessOptions("Successfully edited plan")))
      .catch(() => toast(toastErrorOptions("Failed to edit plan")));
  }

  const removePlan = (planId: string) => () => {
    remove(planId)
      .then(() => toast(toastSuccessOptions("Successfully removed plan")))
      .catch(() => toast(toastErrorOptions("Failed to remove plan")));
  }

  return (
    <Stack spacing={4}>
      <Heading mb={2}>Plans</Heading>

      <Stack>
        {(plans && plans.length === 0) && <Text color="gray">No plans yet</Text>}
        {plans && plans.map(p => (
          <PlansListEntry
            plan={p}
            updatePlan={updatePlan(p.id)}
            removePlan={removePlan(p.id)}
            key={p.id}
          />
        ))}
      </Stack>


      <AddPlanButton addPlan={addPlan}/>
    </Stack>
  )
}

export default PlansList;
