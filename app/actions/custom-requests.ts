'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CreateCustomRequestInput {
  name: string
  email: string
  phone: string
  product_type: string
  size: string
  frame_option: string
  notes?: string
  image_url?: string | null
  estimated_price?: number
}

export async function createCustomRequest(
  data: CreateCustomRequestInput
) {
  try {
    const supabase = await createClient()

    console.log("CUSTOM REQUEST DATA:", data)

    const { data: request, error } = await supabase
      .from('custom_requests')
      .insert([
        {
          user_id: null,
          name: data.name,
          email: data.email,
          phone: data.phone,
          product_type: data.product_type,
          size: data.size,
          frame_option: data.frame_option,
          image_url: data.image_url || null,
          notes: data.notes || null,
          estimated_price: data.estimated_price || 0,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error(
        "CREATE CUSTOM REQUEST ERROR:",
        error
      )

      throw new Error(error.message)
    }

    console.log(
      "CUSTOM REQUEST CREATED:",
      request
    )

    revalidatePath('/admin')
    revalidatePath('/admin/custom-requests')

    return {
      success: true,
      request,
    }

  } catch (error: any) {
    console.error(
      "CREATE CUSTOM REQUEST FAILED:",
      error
    )

    throw new Error(
      error.message || "Failed to create custom request"
    )
  }
}


export async function getCustomRequests() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('custom_requests')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      throw new Error(error.message)
    }

    return data

  } catch (error: any) {
    console.error(
      "GET CUSTOM REQUESTS FAILED:",
      error
    )

    throw new Error(
      error.message || "Failed to fetch custom requests"
    )
  }
}


export async function updateCustomRequestStatus(
  id: string,
  status: string
) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('custom_requests')
      .update({
        status,
      })
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin/custom-requests')
    revalidatePath('/admin')

    return {
      success: true,
    }

  } catch (error: any) {
    console.error(
      "UPDATE CUSTOM REQUEST FAILED:",
      error
    )

    throw new Error(
      error.message || "Failed to update custom request"
    )
  }
}


export async function deleteCustomRequest(
  id: string
) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('custom_requests')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin/custom-requests')
    revalidatePath('/admin')

    return {
      success: true,
    }

  } catch (error: any) {
    console.error(
      "DELETE CUSTOM REQUEST FAILED:",
      error
    )

    throw new Error(
      error.message || "Failed to delete custom request"
    )
  }
}
