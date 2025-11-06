#!/usr/bin/env node
/**
 * Synchronizes user_id from Web UI LocalStorage to Claude Desktop config
 *
 * Usage:
 *   1. Open Web UI in browser (http://localhost:3001)
 *   2. Open browser DevTools Console
 *   3. Run: localStorage.getItem('fidus_user_id')
 *   4. Copy the user_id
 *   5. Run this script: node scripts/sync-user-id.js <user_id>
 *
 * Or use the automatic method:
 *   node scripts/sync-user-id.js --auto
 *   (This will prompt you to paste the user_id)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Claude Desktop config paths by OS
const CONFIG_PATHS = {
  darwin: path.join(process.env.HOME || '~', 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
  win32: path.join(process.env.APPDATA || process.env.USERPROFILE || '~', 'Claude', 'config.json'),
  linux: path.join(process.env.HOME || '~', '.config', 'Claude', 'claude_desktop_config.json'),
};

const PROJECT_CONFIG_PATH = path.join(__dirname, '..', 'claude-desktop-config.json');

function getConfigPath() {
  const platform = process.platform;
  return CONFIG_PATHS[platform] || CONFIG_PATHS.linux;
}

function updateConfig(configPath, userId) {
  try {
    let config = {};

    // Read existing config if it exists
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(content);
    }

    // Ensure mcpServers exists
    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    // Get absolute path to the wrapper script
    const scriptPath = path.join(__dirname, '..', 'packages', 'api', 'run_mcp_stdio.sh');
    const absoluteScriptPath = path.resolve(scriptPath);

    // Ensure fidus-memory server exists with stdio transport
    if (!config.mcpServers['fidus-memory']) {
      config.mcpServers['fidus-memory'] = {
        command: absoluteScriptPath,
        args: [],
        env: {
          NEO4J_URI: "bolt://localhost:7687",
          NEO4J_USER: "neo4j",
          NEO4J_PASSWORD: "fidus-memory-dev-password",
          QDRANT_HOST: "localhost",
          QDRANT_PORT: "6333",
          FIDUS_LLM_MODEL: "openai/gpt-4o-mini",
          OLLAMA_API_BASE: "http://localhost:11434"
        },
        disabled: false,
        alwaysAllow: [],
        timeout: 60000
      };
    }

    // Ensure env object exists
    if (!config.mcpServers['fidus-memory'].env) {
      config.mcpServers['fidus-memory'].env = {};
    }

    // Update command and args to use stdio transport via wrapper script
    config.mcpServers['fidus-memory'].command = absoluteScriptPath;
    config.mcpServers['fidus-memory'].args = [];

    // Set the X-USER-ID
    config.mcpServers['fidus-memory'].env['X_USER_ID'] = userId;

    // Set other required environment variables if missing
    if (!config.mcpServers['fidus-memory'].env.NEO4J_URI) {
      config.mcpServers['fidus-memory'].env.NEO4J_URI = "bolt://localhost:7687";
    }
    if (!config.mcpServers['fidus-memory'].env.NEO4J_USER) {
      config.mcpServers['fidus-memory'].env.NEO4J_USER = "neo4j";
    }
    if (!config.mcpServers['fidus-memory'].env.NEO4J_PASSWORD) {
      config.mcpServers['fidus-memory'].env.NEO4J_PASSWORD = "fidus-memory-dev-password";
    }
    if (!config.mcpServers['fidus-memory'].env.QDRANT_HOST) {
      config.mcpServers['fidus-memory'].env.QDRANT_HOST = "localhost";
    }
    if (!config.mcpServers['fidus-memory'].env.QDRANT_PORT) {
      config.mcpServers['fidus-memory'].env.QDRANT_PORT = "6333";
    }
    if (!config.mcpServers['fidus-memory'].env.FIDUS_LLM_MODEL) {
      config.mcpServers['fidus-memory'].env.FIDUS_LLM_MODEL = "openai/gpt-4o-mini";
    }
    if (!config.mcpServers['fidus-memory'].env.OLLAMA_API_BASE) {
      config.mcpServers['fidus-memory'].env.OLLAMA_API_BASE = "http://localhost:11434";
    }

    // Remove old HTTP-based configuration if present
    delete config.mcpServers['fidus-memory'].initializationOptions;

    // Add global instructions if missing
    if (!config.globalCustomInstructions) {
      config.globalCustomInstructions = fs.readFileSync(PROJECT_CONFIG_PATH, 'utf8')
        .match(/"globalCustomInstructions":\s*"([^"]*)"/)[1]
        .replace(/\\n/g, '\n');
    }

    // Write updated config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

    console.log(`✅ Successfully updated Claude Desktop config at:`);
    console.log(`   ${configPath}`);
    console.log(`\n📝 X-USER-ID set to: ${userId}`);
    console.log(`\n🔄 Please restart Claude Desktop for changes to take effect.`);

    return true;
  } catch (error) {
    console.error(`❌ Error updating config: ${error.message}`);
    return false;
  }
}

function updateProjectConfig(userId) {
  try {
    const config = JSON.parse(fs.readFileSync(PROJECT_CONFIG_PATH, 'utf8'));

    if (!config.mcpServers['fidus-memory'].env) {
      config.mcpServers['fidus-memory'].env = {};
    }

    config.mcpServers['fidus-memory'].env['X_USER_ID'] = userId;

    fs.writeFileSync(PROJECT_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');

    console.log(`✅ Also updated project config: claude-desktop-config.json`);

    return true;
  } catch (error) {
    console.error(`⚠️  Warning: Could not update project config: ${error.message}`);
    return false;
  }
}

async function promptForUserId() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n📋 To get your user_id from the Web UI:');
    console.log('   1. Open http://localhost:3001 in your browser');
    console.log('   2. Open DevTools Console (F12 or Cmd+Option+I)');
    console.log('   3. Run: localStorage.getItem("fidus_user_id")');
    console.log('   4. Copy the user_id (without quotes)\n');

    rl.question('Paste your user_id here: ', (answer) => {
      rl.close();
      resolve(answer.trim().replace(/['"]/g, ''));
    });
  });
}

async function main() {
  const args = process.argv.slice(2);

  let userId;

  if (args.length === 0 || args[0] === '--auto') {
    userId = await promptForUserId();
  } else {
    userId = args[0].trim().replace(/['"]/g, '');
  }

  if (!userId) {
    console.error('❌ Error: No user_id provided');
    process.exit(1);
  }

  // Validate user_id format (should be UUID or guest-UUID)
  const uuidRegex = /^(?:guest-)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    console.error(`❌ Error: Invalid user_id format. Expected UUID or guest-UUID, got: ${userId}`);
    process.exit(1);
  }

  const configPath = getConfigPath();

  console.log(`\n🔧 Updating Claude Desktop configuration...`);
  console.log(`   Platform: ${process.platform}`);
  console.log(`   Config path: ${configPath}\n`);

  // Update Claude Desktop config
  const success = updateConfig(configPath, userId);

  // Also update project config
  if (success) {
    updateProjectConfig(userId);
  }

  process.exit(success ? 0 : 1);
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Aborted.');
  process.exit(0);
});

main();
