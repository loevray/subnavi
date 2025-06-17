export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          name: Database['public']['Enums']['category_name'];
        };
        Insert: {
          id?: number;
          name: Database['public']['Enums']['category_name'];
        };
        Update: {
          id?: number;
          name?: Database['public']['Enums']['category_name'];
        };
        Relationships: [];
      };
      event_categories: {
        Row: {
          category_id: number;
          event_id: string;
        };
        Insert: {
          category_id: number;
          event_id: string;
        };
        Update: {
          category_id?: number;
          event_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_event_categories_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_event_categories_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          }
        ];
      };
      event_hashtags: {
        Row: {
          event_id: string;
          hashtag_id: number;
        };
        Insert: {
          event_id: string;
          hashtag_id: number;
        };
        Update: {
          event_id?: string;
          hashtag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'event_hashtags_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_hashtags_hashtag_id_fkey';
            columns: ['hashtag_id'];
            isOneToOne: false;
            referencedRelation: 'hashtags';
            referencedColumns: ['id'];
          }
        ];
      };
      events: {
        Row: {
          age_rating: Database['public']['Enums']['age_rating'] | null;
          booking_link: string | null;
          created_at: string | null;
          description: string | null;
          end_datetime: string;
          event_rules: string | null;
          id: string;
          location: string;
          official_website: string | null;
          organizer_contact: string | null;
          organizer_name: string;
          participation_fee: string | null;
          poster_image_url: string | null;
          region_id: number;
          sns_links: Json | null;
          start_datetime: string;
          status: Database['public']['Enums']['event_status'] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          age_rating?: Database['public']['Enums']['age_rating'] | null;
          booking_link?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_datetime: string;
          event_rules?: string | null;
          id?: string;
          location: string;
          official_website?: string | null;
          organizer_contact?: string | null;
          organizer_name: string;
          participation_fee?: string | null;
          poster_image_url?: string | null;
          region_id: number;
          sns_links?: Json | null;
          start_datetime: string;
          status?: Database['public']['Enums']['event_status'] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          age_rating?: Database['public']['Enums']['age_rating'] | null;
          booking_link?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_datetime?: string;
          event_rules?: string | null;
          id?: string;
          location?: string;
          official_website?: string | null;
          organizer_contact?: string | null;
          organizer_name?: string;
          participation_fee?: string | null;
          poster_image_url?: string | null;
          region_id?: number;
          sns_links?: Json | null;
          start_datetime?: string;
          status?: Database['public']['Enums']['event_status'] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'events_region_id_fkey';
            columns: ['region_id'];
            isOneToOne: false;
            referencedRelation: 'regions';
            referencedColumns: ['id'];
          }
        ];
      };
      hashtags: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      regions: {
        Row: {
          id: number;
          name: Database['public']['Enums']['region_name'];
        };
        Insert: {
          id?: number;
          name: Database['public']['Enums']['region_name'];
        };
        Update: {
          id?: number;
          name?: Database['public']['Enums']['region_name'];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      gtrgm_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gtrgm_decompress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gtrgm_in: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gtrgm_options: {
        Args: { '': unknown };
        Returns: undefined;
      };
      gtrgm_out: {
        Args: { '': unknown };
        Returns: unknown;
      };
      set_limit: {
        Args: { '': number };
        Returns: number;
      };
      show_limit: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      show_trgm: {
        Args: { '': string };
        Returns: string[];
      };
    };
    Enums: {
      age_rating: '전체관람가' | '12세 이상' | '15세 이상' | '18세 이상';
      category_name:
        | '만화'
        | '웹툰'
        | '게임'
        | '코스프레'
        | '판매부스'
        | 'VTuber'
        | '기타'
        | '장르무관';
      event_status: 'active' | 'cancelled' | 'ended';
      region_name:
        | '서울'
        | '부산'
        | '대구'
        | '인천'
        | '광주'
        | '대전'
        | '울산'
        | '세종'
        | '경기'
        | '강원'
        | '충북'
        | '충남'
        | '전북'
        | '전남'
        | '경북'
        | '경남'
        | '제주';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
      DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] &
      DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      age_rating: ['전체관람가', '12세 이상', '15세 이상', '18세 이상'],
      category_name: [
        '만화',
        '웹툰',
        '게임',
        '코스프레',
        '판매부스',
        'VTuber',
        '기타',
        '장르무관',
      ],
      event_status: ['active', 'cancelled', 'ended'],
      region_name: [
        '서울',
        '부산',
        '대구',
        '인천',
        '광주',
        '대전',
        '울산',
        '세종',
        '경기',
        '강원',
        '충북',
        '충남',
        '전북',
        '전남',
        '경북',
        '경남',
        '제주',
      ],
    },
  },
} as const;
