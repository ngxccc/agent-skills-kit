package config

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
)

const ConfigPath = ".claude/ag-custom-config.json"

type TargetLayer struct {
	Name        string
	Description string
	Selected    bool
}

var DefaultTargetLayers = []TargetLayer{
	{Name: ".claude", Description: "Claude Code & Anthropic harness layer (SSOT)", Selected: true},
	{Name: ".omp", Description: "Oh My Pi harness layer & plugins", Selected: true},
	{Name: ".codex", Description: "Codex harness layer & TOML agents", Selected: true},
	{Name: ".agents", Description: "Agent skills compatibility layer", Selected: true},
	{Name: "process/development-protocols", Description: "RIPER-5 protocols & references", Selected: true},
	{Name: "process/context", Description: "Authoritative repo context files", Selected: true},
}
func TargetExists(name string) bool {
	_, err := os.Lstat(name)
	return err == nil
}

type SkillInfo struct {
	Name        string
	Category    string
	SourcePath  string
	Description string
}

type SkillsConfig struct {
	Mode    string   `json:"mode"`
	Include []string `json:"include"`
	Exclude []string `json:"exclude"`
	Topics  []string `json:"topics,omitempty"`
}

type OptionsConfig struct {
	PreserveUserContent          bool `json:"preserveUserContent"`
	RefuseOverwriteNonSymlinkDir bool `json:"refuseOverwriteNonSymlinkDir"`
}

type Config struct {
	Schema         string        `json:"$schema"`
	Version        string        `json:"version"`
	UpdatedAt      string        `json:"updatedAt"`
	InstallMode    string        `json:"installMode"`
	SymlinkScope   string        `json:"symlinkScope"`
	KitRepoPath    string        `json:"kitRepoPath"`
	Targets        []string      `json:"targets"`
	SymlinkTargets []string      `json:"symlinkTargets"`
	Skills         SkillsConfig  `json:"skills"`
	Options        OptionsConfig `json:"options"`
}

func LoadConfig() *Config {
	data, err := os.ReadFile(ConfigPath)
	if err != nil {
		return nil
	}
	var cfg Config
	if err := json.Unmarshal(data, &cfg); err != nil {
		return nil
	}
	return &cfg
}

func SaveConfig(cfg *Config) error {
	dir := filepath.Dir(ConfigPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}
	data, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}
	data = append(data, '\n')
	return os.WriteFile(ConfigPath, data, 0644)
}

func DiscoverSkills(kitRepoPath string) []SkillInfo {
	var skills []SkillInfo
	seen := make(map[string]bool)

	// 1. Core Harness Skills (.claude/skills/ag-*)
	claudeSkillsDir := filepath.Join(kitRepoPath, ".claude", "skills")
	if entries, err := os.ReadDir(claudeSkillsDir); err == nil {
		for _, e := range entries {
			if e.IsDir() && !strings.HasPrefix(e.Name(), ".") {
				skills = append(skills, SkillInfo{
					Name:       e.Name(),
					Category:   "Core Harness (ag-*)",
					SourcePath: filepath.Join(".claude", "skills", e.Name()),
				})
				seen[e.Name()] = true
			}
		}
	}

	// 2. Framework & Ecosystem Skills (skills/*)
	skillsDir := filepath.Join(kitRepoPath, "skills")
	if entries, err := os.ReadDir(skillsDir); err == nil {
		for _, e := range entries {
			if e.IsDir() && !strings.HasPrefix(e.Name(), ".") && !seen[e.Name()] {
				skills = append(skills, SkillInfo{
					Name:       e.Name(),
					Category:   "Framework & Ecosystem",
					SourcePath: filepath.Join("skills", e.Name()),
				})
				seen[e.Name()] = true
			}
		}
	}

	// 3. Curated Extra Skills (skills/.curated/*)
	curatedDir := filepath.Join(kitRepoPath, "skills", ".curated")
	if entries, err := os.ReadDir(curatedDir); err == nil {
		for _, e := range entries {
			if e.IsDir() && !strings.HasPrefix(e.Name(), ".") && !seen[e.Name()] {
				skills = append(skills, SkillInfo{
					Name:       e.Name(),
					Category:   "Curated Extra",
					SourcePath: filepath.Join("skills", ".curated", e.Name()),
				})
				seen[e.Name()] = true
			}
		}
	}

	return skills
}

func SkillSourcePath(kitRepoPath, skillName string) string {
	candidatePaths := []string{
		filepath.Join(".claude", "skills", skillName),
		filepath.Join("skills", skillName),
		filepath.Join("skills", ".curated", skillName),
	}
	for _, p := range candidatePaths {
		full := filepath.Join(kitRepoPath, p)
		if fi, err := os.Stat(full); err == nil && fi.IsDir() {
			return p
		}
	}
	return filepath.Join(".claude", "skills", skillName)
}
