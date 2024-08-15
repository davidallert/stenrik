"use strict";

import config from '../config.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

export default supabase;