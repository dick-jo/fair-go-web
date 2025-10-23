export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: '13.0.5'
	}
	public: {
		Tables: {
			authors: {
				Row: {
					avatar_alt: string | null
					avatar_path: string | null
					bio: string | null
					created_at: string | null
					email: string | null
					id: string
					name: string
					status: string | null
				}
				Insert: {
					avatar_alt?: string | null
					avatar_path?: string | null
					bio?: string | null
					created_at?: string | null
					email?: string | null
					id?: string
					name: string
					status?: string | null
				}
				Update: {
					avatar_alt?: string | null
					avatar_path?: string | null
					bio?: string | null
					created_at?: string | null
					email?: string | null
					id?: string
					name?: string
					status?: string | null
				}
				Relationships: []
			}
			carousel_items: {
				Row: {
					href: string
					id: string
					image_alt: string | null
					image_path: string | null
					label: string
					order: number | null
					title: string
				}
				Insert: {
					href: string
					id?: string
					image_alt?: string | null
					image_path?: string | null
					label: string
					order?: number | null
					title: string
				}
				Update: {
					href?: string
					id?: string
					image_alt?: string | null
					image_path?: string | null
					label?: string
					order?: number | null
					title?: string
				}
				Relationships: []
			}
			news_articles: {
				Row: {
					category: string[] | null
					content: string
					created_at: string | null
					featured_image_alt: string | null
					featured_image_path: string | null
					id: string
					published_at: string | null
					short_title: string | null
					slug: string
					snippet: string
					status: string | null
					title: string
					type: string
				}
				Insert: {
					category?: string[] | null
					content: string
					created_at?: string | null
					featured_image_alt?: string | null
					featured_image_path?: string | null
					id?: string
					published_at?: string | null
					short_title?: string | null
					slug: string
					snippet: string
					status?: string | null
					title: string
					type?: string
				}
				Update: {
					category?: string[] | null
					content?: string
					created_at?: string | null
					featured_image_alt?: string | null
					featured_image_path?: string | null
					id?: string
					published_at?: string | null
					short_title?: string | null
					slug?: string
					snippet?: string
					status?: string | null
					title?: string
					type?: string
				}
				Relationships: []
			}
			philosophy_content: {
				Row: {
					category: string | null
					content: string
					created_at: string | null
					id: string
					order_priority: number | null
					status: string | null
					title: string
					type: string
					updated_at: string | null
				}
				Insert: {
					category?: string | null
					content: string
					created_at?: string | null
					id?: string
					order_priority?: number | null
					status?: string | null
					title: string
					type: string
					updated_at?: string | null
				}
				Update: {
					category?: string | null
					content?: string
					created_at?: string | null
					id?: string
					order_priority?: number | null
					status?: string | null
					title?: string
					type?: string
					updated_at?: string | null
				}
				Relationships: []
			}
			policy_content: {
				Row: {
					category: string[] | null
					created_at: string | null
					id: string
					introduction: string | null
					order_priority: number | null
					outcomes: string | null
					problem: string | null
					short_title: string | null
					slug: string | null
					snippet: string
					solution: string | null
					solution_rationale: string | null
					status: string | null
					title: string
					updated_at: string | null
				}
				Insert: {
					category?: string[] | null
					created_at?: string | null
					id?: string
					introduction?: string | null
					order_priority?: number | null
					outcomes?: string | null
					problem?: string | null
					short_title?: string | null
					slug?: string | null
					snippet: string
					solution?: string | null
					solution_rationale?: string | null
					status?: string | null
					title: string
					updated_at?: string | null
				}
				Update: {
					category?: string[] | null
					created_at?: string | null
					id?: string
					introduction?: string | null
					order_priority?: number | null
					outcomes?: string | null
					problem?: string | null
					short_title?: string | null
					slug?: string | null
					snippet?: string
					solution?: string | null
					solution_rationale?: string | null
					status?: string | null
					title?: string
					updated_at?: string | null
				}
				Relationships: []
			}
			profiles: {
				Row: {
					aec_data_sharing_consent_at: string | null
					created_at: string | null
					date_of_birth: string | null
					first_name: string | null
					id: string
					is_member: boolean
					is_volunteer: boolean
					last_name: string | null
					membership_expires_at: string | null
					membership_paid_at: string | null
					membership_tier: string | null
					party_exclusivity_confirmed_at: string | null
					phone: string | null
					pledge_accepted_at: string | null
					postcode: string | null
					state: string | null
					street_address: string | null
					stripe_customer_id: string | null
					stripe_membership_subscription_id: string | null
					suburb: string | null
					updated_at: string | null
				}
				Insert: {
					aec_data_sharing_consent_at?: string | null
					created_at?: string | null
					date_of_birth?: string | null
					first_name?: string | null
					id: string
					is_member?: boolean
					is_volunteer?: boolean
					last_name?: string | null
					membership_expires_at?: string | null
					membership_paid_at?: string | null
					membership_tier?: string | null
					party_exclusivity_confirmed_at?: string | null
					phone?: string | null
					pledge_accepted_at?: string | null
					postcode?: string | null
					state?: string | null
					street_address?: string | null
					stripe_customer_id?: string | null
					stripe_membership_subscription_id?: string | null
					suburb?: string | null
					updated_at?: string | null
				}
				Update: {
					aec_data_sharing_consent_at?: string | null
					created_at?: string | null
					date_of_birth?: string | null
					first_name?: string | null
					id?: string
					is_member?: boolean
					is_volunteer?: boolean
					last_name?: string | null
					membership_expires_at?: string | null
					membership_paid_at?: string | null
					membership_tier?: string | null
					party_exclusivity_confirmed_at?: string | null
					phone?: string | null
					pledge_accepted_at?: string | null
					postcode?: string | null
					state?: string | null
					street_address?: string | null
					stripe_customer_id?: string | null
					stripe_membership_subscription_id?: string | null
					suburb?: string | null
					updated_at?: string | null
				}
				Relationships: []
			}
			subscribers: {
				Row: {
					created_at: string
					email: string
					email_opt_in: boolean
					id: string
					source: string | null
					unsubscribed_at: string | null
					upgraded_at: string | null
					user_id: string | null
				}
				Insert: {
					created_at?: string
					email: string
					email_opt_in?: boolean
					id?: string
					source?: string | null
					unsubscribed_at?: string | null
					upgraded_at?: string | null
					user_id?: string | null
				}
				Update: {
					created_at?: string
					email?: string
					email_opt_in?: boolean
					id?: string
					source?: string | null
					unsubscribed_at?: string | null
					upgraded_at?: string | null
					user_id?: string | null
				}
				Relationships: []
			}
			team_members: {
				Row: {
					address: string | null
					bio: string
					created_at: string | null
					email: string | null
					facebook_handle: string | null
					hero_image_alt: string | null
					hero_image_path: string | null
					id: string
					instagram_handle: string | null
					name: string
					order_priority: number | null
					phone: string | null
					policy_priority_1_id: string | null
					policy_priority_2_id: string | null
					policy_priority_3_id: string | null
					profile_image_alt: string | null
					profile_image_path: string | null
					short_bio: string | null
					slug: string
					status: string | null
					title: string
					updated_at: string | null
				}
				Insert: {
					address?: string | null
					bio: string
					created_at?: string | null
					email?: string | null
					facebook_handle?: string | null
					hero_image_alt?: string | null
					hero_image_path?: string | null
					id?: string
					instagram_handle?: string | null
					name: string
					order_priority?: number | null
					phone?: string | null
					policy_priority_1_id?: string | null
					policy_priority_2_id?: string | null
					policy_priority_3_id?: string | null
					profile_image_alt?: string | null
					profile_image_path?: string | null
					short_bio?: string | null
					slug: string
					status?: string | null
					title: string
					updated_at?: string | null
				}
				Update: {
					address?: string | null
					bio?: string
					created_at?: string | null
					email?: string | null
					facebook_handle?: string | null
					hero_image_alt?: string | null
					hero_image_path?: string | null
					id?: string
					instagram_handle?: string | null
					name?: string
					order_priority?: number | null
					phone?: string | null
					policy_priority_1_id?: string | null
					policy_priority_2_id?: string | null
					policy_priority_3_id?: string | null
					profile_image_alt?: string | null
					profile_image_path?: string | null
					short_bio?: string | null
					slug?: string
					status?: string | null
					title?: string
					updated_at?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'team_members_pet_policy_1_id_fkey'
						columns: ['policy_priority_1_id']
						isOneToOne: false
						referencedRelation: 'policy_content'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'team_members_pet_policy_2_id_fkey'
						columns: ['policy_priority_2_id']
						isOneToOne: false
						referencedRelation: 'policy_content'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'team_members_pet_policy_3_id_fkey'
						columns: ['policy_priority_3_id']
						isOneToOne: false
						referencedRelation: 'policy_content'
						referencedColumns: ['id']
					}
				]
			}
			transactions: {
				Row: {
					amount: number
					created_at: string | null
					currency: string | null
					donor_metadata: Json | null
					env: string | null
					id: string
					status: string | null
					stripe_payment_id: string | null
					stripe_subscription_id: string | null
					transaction_type: string
					user_id: string | null
				}
				Insert: {
					amount: number
					created_at?: string | null
					currency?: string | null
					donor_metadata?: Json | null
					env?: string | null
					id?: string
					status?: string | null
					stripe_payment_id?: string | null
					stripe_subscription_id?: string | null
					transaction_type: string
					user_id?: string | null
				}
				Update: {
					amount?: number
					created_at?: string | null
					currency?: string | null
					donor_metadata?: Json | null
					env?: string | null
					id?: string
					status?: string | null
					stripe_payment_id?: string | null
					stripe_subscription_id?: string | null
					transaction_type?: string
					user_id?: string | null
				}
				Relationships: []
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			update_email_opt_in_anonymous: {
				Args: { new_opt_in: boolean; target_email: string }
				Returns: boolean
			}
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never

export const Constants = {
	public: {
		Enums: {}
	}
} as const
